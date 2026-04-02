# import sys
# import os
# sys.path.append(os.path.abspath(".."))

# from fastapi import APIRouter, Depends
# from mongo_log import collection
# from dependencies import get_current_user
# from active_users import get_active_count
# from datetime import datetime, timedelta

# router = APIRouter()

# # =========================
# # 📊 ADMIN ANALYTICS API
# # =========================
# @router.get("/admin-analytics")
# def get_admin_analytics(current_user=Depends(get_current_user)):
#     active_users = get_active_count()

#     if current_user["role"] != "admin":
#         return {"error":"Unauthorized"}

#     total = collection.count_documents({})

#     mask = collection.count_documents({"status":"Mask"})
#     no_mask = collection.count_documents({"status":"No Mask"})

#     webcam = collection.count_documents({"source":"webcam"})
#     upload = collection.count_documents({"source":"upload"})
#     # system = collection.count_documents({"source":"system"})

#     # today detections
#     today = datetime.utcnow() - timedelta(days=1)
#     today_count = collection.count_documents({
#         "timestamp": {"$gte": str(today)}
#     })

#     return {
#         "total": total,
#         "mask": mask,
#         "no_mask": no_mask,
#         "webcam": webcam,
#         "upload": upload,
#         # "system": system,
#         "today": today_count,
#         "active_users": active_users
#     }
# @router.get("/admin-logs")
# def get_all_logs(current_user=Depends(get_current_user)):
#     if current_user["role"] != "admin":
#         return {"error": "Unauthorized"}

#     # Fetch ALL logs from MongoDB, sorted newest first
#     logs_cursor = collection.find({}, {"_id": 0}).sort("timestamp", -1)
#     logs = list(logs_cursor)

#     return {
#         "logs": logs,
#         "total": len(logs)
#     }
import sys
import os
sys.path.append(os.path.abspath(".."))

from fastapi import APIRouter, Depends
from mongo_log import collection
from dependencies import get_current_user
from active_users import get_active_count
from datetime import datetime, timezone

router = APIRouter()

# =========================
# 📊 ADMIN ANALYTICS API
# =========================
@router.get("/admin-analytics")
def get_admin_analytics(current_user=Depends(get_current_user)):
    active_users = get_active_count()

    if current_user["role"] != "admin":
        return {"error":"Unauthorized"}

    # All-time totals
    total = collection.count_documents({})
    mask = collection.count_documents({"status":"Mask"})
    no_mask = collection.count_documents({"status":"No Mask"})

    # Get today's date in the same format as your timestamps
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")  # "2026-02-19"
    
    # ✅ Count only TODAY's detections using regex
    today_count = collection.count_documents({
        "timestamp": {"$regex": f"^{today_str}"}  # Matches "2026-02-19_..."
    })
    
    # ✅ Today's webcam detections only
    webcam_today = collection.count_documents({
        "source": "webcam",
        "timestamp": {"$regex": f"^{today_str}"}
    })
    
    # ✅ Today's upload detections only
    upload_today = collection.count_documents({
        "source": "upload",
        "timestamp": {"$regex": f"^{today_str}"}
    })

    return {
        "total": total,
        "mask": mask,
        "no_mask": no_mask,
        "webcam": webcam_today,  # ✅ Only today
        "upload": upload_today,  # ✅ Only today
        "today": today_count,
        "active_users": active_users
    }

@router.get("/admin-logs")
def get_all_logs(current_user=Depends(get_current_user)):
    if current_user["role"] != "admin":
        return {"error": "Unauthorized"}

    # Fetch ALL logs from MongoDB, sorted newest first
    logs_cursor = collection.find({}, {"_id": 0}).sort("timestamp", -1)
    logs = list(logs_cursor)

    return {
        "logs": logs,
        "total": len(logs)
    }