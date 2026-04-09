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

# Deep Learning SSD Face Detector (Gatekeeper)
PROTOTXT_PATH = "../Models/deploy.prototxt"
CAFFEMODEL_PATH = "../Models/res10_300x300_ssd_iter_140000.caffemodel"
face_net = cv2.dnn.readNetFromCaffe(PROTOTXT_PATH, CAFFEMODEL_PATH)

def get_best_face(frame, confidence_threshold=0.6):
    """
    Gatekeeper Function: Identifies the most confident face in the frame using DNN.
    Returns (x, y, w, h) of the face, or None if no valid face is found.
    """
    (h, w) = frame.shape[:2]
    # Create a blob from the image: resizing to 300x300 for the model
    blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0))
    face_net.setInput(blob)
    detections = face_net.forward()
    
    best_confidence = 0
    best_box = None
    
    # Loop over the detections
    for i in range(0, detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        # Filter weak detections
        if confidence > confidence_threshold and confidence > best_confidence:
            best_confidence = confidence
            # Compute (x, y) coordinates for bounding box
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")
            
            # Ensure the bounding boxes fall within the dimensions of the frame
            (startX, startY) = (max(0, startY), max(0, startY)) # Correction: startX, startY limit check
            (startX, startY) = (max(0, startX), max(0, startY))
            (endX, endY) = (min(w - 1, endX), min(h - 1, endY))
            
            if endX > startX and endY > startY:
                best_box = (startX, startY, endX - startX, endY - startY)
                
    return best_box

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

    # 2. YCrCb Skin Check (Calibrated for High Sensitivity)
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
    print(f" Skin Analysis -> Ratio: {skin_ratio:.4f} (Need > 0.01)")

    # Require only 1% of ROI to be actual human skin pigment (v. sensitive for indoor use)
    return skin_ratio > 0.01


# =========================
# 📤 IMAGE UPLOAD API
# =========================
@router.post("/detect-image")
def detect_image(file: UploadFile = File(...), current_user=Depends(get_current_user)):

    filename = f"{current_user['email'].split('@')[0]}_{file.filename}"
    temp_path = os.path.join(UPLOAD_DIR, filename)

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Convert to OpenCV format for the Gatekeeper
    frame = cv2.imread(temp_path)
    if frame is None:
        return {"error": "Invalid image file format"}

    # =========================
    # 🛑 GATEKEEPER: FACE VALIDATION
    # =========================
    face_box = get_best_face(frame, confidence_threshold=0.6)
    
    if not face_box:
        # Ignore random non-face images without polluting logs with "Mask/No Mask"
        try:
            os.remove(temp_path)
        except:
            pass
        return {
            "prediction": "No Face",
            "confidence": 0,
            "user": current_user["email"],
            "role": current_user["role"]
        }

    # Extract Face ROI
    x, y, w, h = face_box
    face_roi = frame[y:y+h, x:x+w]

    # Convert ROI to PIL for PyTorch Mask CNN
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
        # 1️⃣ FACE DETECTION (DNN GATEKEEPER)
        # =========================
        face_box = get_best_face(frame, confidence_threshold=0.5)

        # =========================
        # 🚫 NO FACE FOUND = RETURN
        # =========================
        if not face_box:
            return {
                "prediction": "No Face",
                "confidence": 0
            }

        # =========================
        # 2️⃣ EXTRACT FACE ROI
        # =========================
        x, y, w, h = face_box
        face_roi = frame[y:y+h, x:x+w]

        # Removed obsolete is_real_face skin texture check.
        # The DNN Gatekeeper handles false-positive wall detection much better,
        # and the skin check was failing aggressively in low light conditions.

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