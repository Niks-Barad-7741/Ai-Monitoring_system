import sys
import os
sys.path.append(os.path.abspath(".."))

from fastapi import APIRouter, Depends
from mongo_log import collection
from dependencies import get_current_user
from active_users import get_active_count
from datetime import datetime, timedelta

router = APIRouter()

# =========================
# 📊 ADMIN ANALYTICS API
# =========================
@router.get("/admin-analytics")
def get_admin_analytics(current_user=Depends(get_current_user)):
    active_users = get_active_count()

    if current_user["role"] != "admin":
        return {"error":"Unauthorized"}

    total = collection.count_documents({})

    mask = collection.count_documents({"status":"Mask"})
    no_mask = collection.count_documents({"status":"No Mask"})

    webcam = collection.count_documents({"source":"webcam"})
    upload = collection.count_documents({"source":"upload"})
    # system = collection.count_documents({"source":"system"})

    # today detections
    today = datetime.utcnow() - timedelta(days=1)
    today_count = collection.count_documents({
        "timestamp": {"$gte": str(today)}
    })

    return {
        "total": total,
        "mask": mask,
        "no_mask": no_mask,
        "webcam": webcam,
        "upload": upload,
        # "system": system,
        "today": today_count,
        "active_users": active_users
    }