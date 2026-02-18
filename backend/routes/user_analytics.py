from fastapi import APIRouter, Depends
from mongo_log import collection
from dependencies import get_current_user
from datetime import datetime, timedelta

router = APIRouter()

# =========================
# 👤 USER ANALYTICS
# =========================
@router.get("/user-analytics")
def get_user_analytics(current_user=Depends(get_current_user)):

    email = current_user["email"]

    # only this user's logs
    total = collection.count_documents({"email": email})
    mask = collection.count_documents({"email": email, "status":"Mask"})
    no_mask = collection.count_documents({"email": email, "status":"No Mask"})

    webcam = collection.count_documents({"email": email, "source":"webcam"})
    upload = collection.count_documents({"email": email, "source":"upload"})

    today = datetime.utcnow() - timedelta(days=1)
    today_count = collection.count_documents({
        "email": email,
        "timestamp": {"$gte": str(today)}
    })

    return {
        "total": total,
        "mask": mask,
        "no_mask": no_mask,
        "webcam": webcam,
        "upload": upload,
        "today": today_count
    }