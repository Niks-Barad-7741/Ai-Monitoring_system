# import sys
# import os
# sys.path.append(os.path.abspath(".."))
# from fastapi import APIRouter, UploadFile, File, Depends
# import shutil
# import os
# import cv2
# import torch
# from PIL import Image
# from torchvision import transforms
# from datetime import datetime

# from mongo_log import save_log
# from dependencies import get_current_user

# router = APIRouter()

# # =========================
# # LOAD MODEL (once only)
# # =========================
# MODEL_PATH = "../Models/scratch_mask_cnn_best.pth"

# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# from scratch_model import ScratchMaskCNN   # 👈 IMPORTANT import your model class

# model = torch.load(
#     MODEL_PATH,
#     map_location=device,
#     weights_only=False   # 🔥 IMPORTANT FIX
# )
# model.eval()   

# classes = ["Mask","No Mask"]

# transform = transforms.Compose([
#     transforms.Resize((128,128)),
#     transforms.ToTensor(),
#     transforms.Normalize([0.5,0.5,0.5],[0.5,0.5,0.5])
# ])

# # =========================
# # IMAGE UPLOAD DETECTION
# # =========================
# @router.post("/detect-image")
# def detect_image(file: UploadFile = File(...), current_user=Depends(get_current_user)):

#     temp_path = f"temp_{file.filename}"

#     with open(temp_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     image = Image.open(temp_path).convert("RGB")
#     input_tensor = transform(image).unsqueeze(0).to(device)

#     with torch.no_grad():
#         output = model(input_tensor)
#         probs = torch.softmax(output, dim=1)[0]
#         conf, pred = torch.max(probs, 0)

#     confidence = conf.item()
#     label = classes[pred.item()]

#     # save log
#     save_log(
#         label,
#         confidence,
#         temp_path,
#         email=current_user["email"],
#         role=current_user["role"],
#         source="upload"
#     )

#     return {
#         "prediction": label,
#         "confidence": round(confidence*100,2),
#         "user": current_user["email"]
#     }
import sys
import os
sys.path.append(os.path.abspath(".."))

from fastapi import APIRouter, UploadFile, File, Depends
import shutil
import torch
from PIL import Image
from torchvision import transforms

from mongo_log import save_log
from dependencies import get_current_user
from scratch_model import ScratchMaskCNN   # custom model class

router = APIRouter()

# =========================
# 📁 MODEL PATH
# =========================
MODEL_PATH = "../Models/scratch_mask_cnn_best.pth"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# =========================
# 🤖 LOAD MODEL ONCE
# =========================
model = torch.load(
    MODEL_PATH,
    map_location=device,
    weights_only=False
)

model.to(device)
model.eval()   # 🔥 IMPORTANT

classes = ["Mask","No Mask"]

transform = transforms.Compose([
    transforms.Resize((128,128)),
    transforms.ToTensor(),
    transforms.Normalize([0.5,0.5,0.5],[0.5,0.5,0.5])
])

# =========================
# 📁 TEMP IMAGE FOLDER
# =========================
UPLOAD_DIR = "../logs_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# =========================
# 🧠 IMAGE UPLOAD DETECTION
# =========================
@router.post("/detect-image")
def detect_image(file: UploadFile = File(...),
                 current_user=Depends(get_current_user)):

    # unique filename
    filename = f"{current_user['email'].split('@')[0]}_{file.filename}"
    temp_path = os.path.join(UPLOAD_DIR, filename)

    # save image
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # read image
    image = Image.open(temp_path).convert("RGB")
    input_tensor = transform(image).unsqueeze(0).to(device)

    # prediction
    with torch.no_grad():
        output = model(input_tensor)
        probs = torch.softmax(output, dim=1)[0]
        conf, pred = torch.max(probs, 0)

    confidence = conf.item()
    label = classes[pred.item()]

    # =========================
    # 📝 SAVE LOG
    # =========================
    save_log(
        label,
        confidence,
        temp_path,
        email=current_user["email"],
        role=current_user["role"],
        source="upload"
    )

    return {
        "prediction": label,
        "confidence": round(confidence*100,2),
        "user": current_user["email"],
        "role": current_user["role"]
    }
import base64
import numpy as np
import cv2


# =========================
# 🎥 WEBCAM LIVE DETECTION API
# =========================
@router.post("/detect-webcam")
def detect_webcam(data: dict, current_user=Depends(get_current_user)):

    try:
        # base64 image from frontend
        image_data = data.get("image")

        if not image_data:
            return {"error": "No image received"}

        # remove header if exists
        if "base64," in image_data:
            image_data = image_data.split("base64,")[1]

        # decode base64
        img_bytes = base64.b64decode(image_data)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # convert to PIL
        image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        input_tensor = transform(image).unsqueeze(0).to(device)

        # AI prediction
        with torch.no_grad():
            output = model(input_tensor)
            probs = torch.softmax(output, dim=1)[0]
            conf, pred = torch.max(probs, 0)

        confidence = conf.item()
        label = classes[pred.item()]

        # 🔥 SAVE LOG (webcam source)
        save_log(
            label,
            confidence,
            frame,   # send frame directly
            email=current_user["email"],
            role=current_user["role"],
            source="webcam"
        )

        return {
            "prediction": label,
            "confidence": round(confidence*100,2),
            "user": current_user["email"],
            "role": current_user["role"],
            "source": "webcam"
        }

    except Exception as e:
        print("Webcam API Error:", e)
        return {"error": str(e)}
