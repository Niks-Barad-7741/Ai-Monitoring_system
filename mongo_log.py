from pymongo import MongoClient
from datetime import datetime
import os
import cv2
import asyncio
from dotenv import load_dotenv

# ============================================
# 📁 CONFIGURATION: SHARED FROM BACKEND/.ENV
# ============================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOTENV_PATH = os.path.join(BASE_DIR, "backend", ".env")
load_dotenv(DOTENV_PATH)

# =========================
# 🟢 MongoDB (Strict Loading)
# =========================
MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")

if not MONGO_URL or not DB_NAME:
    print("❌ ERROR: MongoDB Configuration missing from backend/.env")
    # We don't crash the script immediately because Notebooks might import this, 
    # but we prevent the client from initializing incorrectly.
    client = None
    collection = None
else:
    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]
    collection = db["logs"]

# =========================
# 🚀 SAVE LOG FUNCTION (SMART DUPLICATE CHECK)
# =========================
def save_log(status, confidence, frame_or_path, email="system", role="user", source="system"):

    # 1. Get Current Time
    now = datetime.now()
    timestamp_str = now.strftime("%Y-%m-%d_%H-%M-%S")
    
    image_path = ""

    # 2. Determine Image Path
    if isinstance(frame_or_path, str):
        # Case: Upload
        image_path = frame_or_path
    else:
        # Case: Webcam
        image_filename = f"{timestamp_str}.jpg"
        image_path = os.path.join(IMAGE_DIR, image_filename)
        cv2.imwrite(image_path, frame_or_path)

    # ==========================================
    # 🛑 ANTI-SPAM CHECK (The Fix)
    # ==========================================
    # Get the very last log for this user
    last_log = collection.find_one(
        {"email": email},
        sort=[("_id", -1)]
    )

    if last_log:
        # 1. Check if it's the same image path
        if last_log.get("image_path") == image_path:
            
            try:
                # 2. Calculate time difference
                last_time_str = last_log.get("timestamp")
                last_time = datetime.strptime(last_time_str, "%Y-%m-%d_%H-%M-%S")
                
                # Difference in seconds
                seconds_diff = (now - last_time).total_seconds()

                # 🔥 IF LESS THAN 10 SECONDS -> IGNORE (Spam Click)
                if seconds_diff < 60:
                    print(f" Spam detected ({int(seconds_diff)}s ago). Skipping log.")
                    return
                
                # If more than 60(1 minute), we allow it (it's a valid re-test)

            except Exception as e:
                print("Time parse error, proceeding to log:", e)

    # ==========================================
    # 📝 SAVE TO MONGODB
    # ==========================================
    log_data = {
        "email": email,
        "role": role,
        "timestamp": timestamp_str,
        "status": status,
        "confidence": float(confidence),
        "image_path": image_path,
        "source": source
    }

    collection.insert_one(log_data)
    if SOCKET_AVAILABLE:
        try:
            asyncio.run(manager.broadcast("new_detection"))
        except:
            pass

    # Broadcast to Frontend
    # try:
    #      asyncio.run(manager.broadcast("new_detection"))
    # except:
    #     pass

    # Save to TXT
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(
            f"{timestamp_str} | {email} | {role} | {status} | "
            f"{round(confidence*100,2)}% | {source} | {image_path}\n"
        )

    print(f"✅ Logged: {status} | {email} | {source}")