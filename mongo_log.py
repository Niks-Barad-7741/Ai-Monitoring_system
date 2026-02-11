# from pymongo import MongoClient
# from datetime import datetime
# import os

# # =========================
# # 📁 ALWAYS USE PROJECT ROOT PATH
# # =========================
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
# LOG_FILE = os.path.join(BASE_DIR, "log.txt")   # <-- always outside notebooks

# # =========================
# # MONGODB CONNECTION
# # =========================
# client = MongoClient("mongodb://localhost:27017/")
# db = client["mask_detection_db"]
# collection = db["logs"]

# # =========================
# # IMAGE FOLDER (root)
# # =========================
# IMAGE_DIR = os.path.join(BASE_DIR, "logs_images")
# os.makedirs(IMAGE_DIR, exist_ok=True)

# # =========================
# # SAVE LOG FUNCTION
# # =========================
# def save_log(status, confidence, image_path, email="system", role="user", source="system"):

#     timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

#     log_data = {
#         "email": email,
#         "role": role,
#         "timestamp": timestamp,
#         "status": status,
#         "confidence": float(confidence),
#         "image_path": image_path,
#         "source": source
#     }

#     # 🔥 save mongodb
#     collection.insert_one(log_data)

#     # 🔥 save txt in ROOT folder (not notebook)
#     with open(LOG_FILE, "a", encoding="utf-8") as f:
#         f.write(
#             f"{timestamp} | {email} | {role} | {status} | "
#             f"{round(confidence*100,2)}% | {source} | {image_path}\n"
#         )

#     print(f"✅ Logged: {status} | {email}")
from pymongo import MongoClient
from datetime import datetime
import os
import cv2
import asyncio
from live_socket import manager

# =========================
# 📁 PROJECT ROOT (VERY IMPORTANT)
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# TXT log in ROOT
LOG_FILE = os.path.join(BASE_DIR, "log.txt")

# =========================
# 📁 IMAGE SAVE → ROOT logs_images folder
# (same level as Dataset, Models, Notebooks)
# =========================
IMAGE_DIR = os.path.join(BASE_DIR, "logs_images")
os.makedirs(IMAGE_DIR, exist_ok=True)

# =========================
# 🟢 MongoDB
# =========================
client = MongoClient("mongodb://localhost:27017/")
db = client["mask_detection_db"]
collection = db["logs"]

# =========================
# 🚀 SAVE LOG FUNCTION
# =========================
def save_log(status, confidence, frame_or_path, email="system", role="user", source="system"):

    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

    # =========================
    # if IMAGE PATH already given (UPLOAD)
    # =========================
    if isinstance(frame_or_path, str):
        image_path = frame_or_path

    # =========================
    # if FRAME given (WEBCAM)
    # =========================
    else:
        image_filename = f"{timestamp}.jpg"
        image_path = os.path.join(IMAGE_DIR, image_filename)

        import cv2
        cv2.imwrite(image_path, frame_or_path)

    # =========================
    # MongoDB log
    # =========================
    log_data = {
        "email": email,
        "role": role,
        "timestamp": timestamp,
        "status": status,
        "confidence": float(confidence),
        "image_path": image_path,
        "source": source
    }

    collection.insert_one(log_data)
    try:
        # loop = asyncio.get_event_loop()

        # loop.create_task(manager.broadcast("new_detection"))
         asyncio.run(manager.broadcast("new_detection"))
    except:
        pass
    

    # =========================
    # TXT log
    # =========================
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(
            f"{timestamp} | {email} | {role} | {status} | "
            f"{round(confidence*100,2)}% | {source} | {image_path}\n"
        )

    print(f"Logged: {status} | {email} | {source}")
