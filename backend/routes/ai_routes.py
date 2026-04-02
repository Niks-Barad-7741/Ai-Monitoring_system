import sys
import os
import shutil
import base64
import numpy as np
import cv2
import torch
from PIL import Image
from torchvision import transforms
from fastapi import APIRouter, UploadFile, File, Depends

# Add parent directory to path
sys.path.append(os.path.abspath(".."))

from mongo_log import save_log
from dependencies import get_current_user
from scratch_model import ScratchMaskCNN 

router = APIRouter()

# =========================
# 📁 MODEL SETUP
# =========================
MODEL_PATH = "../Models/scratch_mask_cnn_best.pth"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = torch.load(MODEL_PATH, map_location=device, weights_only=False)
model.to(device)
model.eval()

classes = ["Mask", "No Mask"]

# Haar Cascade (Standard Face Detector)
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.ToTensor(),
    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
])

UPLOAD_DIR = "../logs_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ==========================================
# 🎨 HELPER: ROBUST YCrCb SKIN DETECTION
# ==========================================
def is_real_face(frame):
    """
    Uses YCrCb Color Space to distinguish Human Skin from Warm Walls/Ceilings.
    """
    # 1. Texture Check (Reject featureless blur)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    variance = cv2.Laplacian(gray, cv2.CV_64F).var()
    
    # Ceiling tiles have edges, so we can't rely solely on variance.
    # But extremely flat walls (<20) are definitely not faces.
    if variance < 20: 
        return False

    # 2. YCrCb Skin Check (The Fix)
    # Convert to YCrCb (Luminance, Red-diff, Blue-diff)
    ycrcb = cv2.cvtColor(frame, cv2.COLOR_BGR2YCrCb)
    
    # Specific Range for Human Skin Pigment (Ignores brightness)
    lower_skin = np.array([0, 133, 77], dtype=np.uint8)
    upper_skin = np.array([255, 173, 127], dtype=np.uint8)
    
    mask = cv2.inRange(ycrcb, lower_skin, upper_skin)
    skin_pixels = cv2.countNonZero(mask)
    total_pixels = frame.shape[0] * frame.shape[1]
    
    skin_ratio = skin_pixels / total_pixels
    
    # Debug info in your terminal
    print(f" Skin Analysis -> Ratio: {skin_ratio:.4f} (Need > 0.05)")

    # Require 5% of the center crop to be actual human skin pigment
    return skin_ratio > 0.05


# =========================
# 📤 IMAGE UPLOAD API
# =========================
@router.post("/detect-image")
def detect_image(file: UploadFile = File(...), current_user=Depends(get_current_user)):

    filename = f"{current_user['email'].split('@')[0]}_{file.filename}"
    temp_path = os.path.join(UPLOAD_DIR, filename)

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Load image with OpenCV for face detection
    frame = cv2.imread(temp_path)
    if frame is None:
        return {"error": "Invalid image format"}

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # 1. Detect faces
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=4,
        minSize=(60, 60) # slightly smaller for static uploads
    )

    if len(faces) == 0:
        return {
            "prediction": "No Face",
            "confidence": 0,
            "user": current_user["email"],
            "role": current_user["role"]
        }

    # 2. Get first face and check skin
    x, y, w, h = faces[0]
    face_roi = frame[y:y+h, x:x+w]

    if not is_real_face(face_roi):
        return {
            "prediction": "No Face",
            "confidence": 0,
            "user": current_user["email"],
            "role": current_user["role"]
        }

    # 3. AI Prediction on crop
    pil_image = Image.fromarray(cv2.cvtColor(face_roi, cv2.COLOR_BGR2RGB))
    input_tensor = transform(pil_image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(input_tensor)
        probs = torch.softmax(output, dim=1)[0]
        conf, pred = torch.max(probs, 0)

    confidence = conf.item()
    label = classes[pred.item()]

    save_log(label, confidence, temp_path, email=current_user["email"], role=current_user["role"], source="upload")

    return {
        "prediction": label,
        "confidence": round(confidence * 100, 2),
        "user": current_user["email"],
        "role": current_user["role"]
    }


# =========================
# 🎥 FINAL WEBCAM LIVE API (ULTRA FIXED)
# =========================
@router.post("/detect-webcam")
def detect_webcam(data: dict, current_user=Depends(get_current_user)):

    try:
        image_data = data.get("image")
        if not image_data:
            return {"error": "No image received"}

        if "base64," in image_data:
            image_data = image_data.split("base64,")[1]

        img_bytes = base64.b64decode(image_data)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # =========================
        # 1️⃣ FACE DETECTION FIRST
        # =========================
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=4,   # strict
            minSize=(90,90)
        )

        # =========================
        # 🚫 NO FACE FOUND = RETURN
        # =========================
        if len(faces) == 0:
            return {
                "prediction": "No Face",
                "confidence": 0
            }

        # =========================
        # 2️⃣ USE FIRST FACE ONLY
        # =========================
        x, y, w, h = faces[0]
        face_roi = frame[y:y+h, x:x+w]

        # =========================
        # 3️⃣ EXTRA SAFETY: SKIN CHECK
        # =========================
        # prevents wall detection
        if not is_real_face(face_roi):
            return {
                "prediction": "No Face",
                "confidence": 0
            }

        # =========================
        # 4️⃣ AI PREDICTION
        # =========================
        pil_image = Image.fromarray(cv2.cvtColor(face_roi, cv2.COLOR_BGR2RGB))
        input_tensor = transform(pil_image).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(input_tensor)
            probs = torch.softmax(output, dim=1)[0]
            conf, pred = torch.max(probs, 0)

        confidence = conf.item()
        label = classes[pred.item()]

        # =========================
        # 5️⃣ SAVE LOG ONLY IF HUMAN
        # =========================
        save_log(
            label,
            confidence,
            frame,
            email=current_user["email"],
            role=current_user["role"],
            source="webcam"
        )

        # =========================
        # 6️⃣ RETURN WITH BOX
        # =========================
        return {
            "prediction": label,
            "confidence": round(confidence * 100, 2),
            "box": {
                "x": int(x),
                "y": int(y),
                "w": int(w),
                "h": int(h)
            }
        }

    except Exception as e:
        print("Webcam API Error:", e)
        return {"error": str(e)}