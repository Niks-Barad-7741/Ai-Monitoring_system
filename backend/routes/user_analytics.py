from fastapi import APIRouter, Depends
from mongo_log import collection
from dependencies import get_current_user
from datetime import datetime, timezone

router = APIRouter()

# =========================
# 👤 USER ANALYTICS
# =========================
@router.get("/user-analytics")
def get_user_analytics(current_user=Depends(get_current_user)):
    email = current_user["email"]

    # All-time totals for this user
    total = collection.count_documents({"email": email})
    mask = collection.count_documents({"email": email, "status":"Mask"})
    no_mask = collection.count_documents({"email": email, "status":"No Mask"})

    # Get today's date in the same format as your timestamps
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")  # "2026-02-19"
    
    # ✅ Count only TODAY's detections using regex
    today_count = collection.count_documents({
        "email": email,
        "timestamp": {"$regex": f"^{today_str}"}
    })
    
    # ✅ Today's webcam detections only
    webcam_today = collection.count_documents({
        "email": email,
        "source": "webcam",
        "timestamp": {"$regex": f"^{today_str}"}
    })
    
    # ✅ Today's upload detections only
    upload_today = collection.count_documents({
        "email": email,
        "source": "upload",
        "timestamp": {"$regex": f"^{today_str}"}
    })

    return {
        "total": total,
        "mask": mask,
        "no_mask": no_mask,
        "webcam": webcam_today,  # ✅ Only today
        "upload": upload_today,  # ✅ Only today
        "today": today_count
    }
@router.get("/user-logs")
def get_user_logs(current_user=Depends(get_current_user)):
    email = current_user["email"]

    # Fetch only THIS user's logs, newest first
    logs_cursor = collection.find(
        {"email": email},
        {"_id": 0}
    ).sort("timestamp", -1)

    logs = list(logs_cursor)

    return {
        "logs": logs,
        "total": len(logs)
    }