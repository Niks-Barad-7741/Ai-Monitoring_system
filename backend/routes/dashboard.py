# from fastapi import APIRouter, Depends
# from database import logs_collection
# from dependencies import get_current_user, admin_only

# router = APIRouter()

# # ==============================
# # 👑 ADMIN DASHBOARD (FULL DATA)
# # ==============================
# @router.get("/admin-dashboard")
# def admin_dashboard(current_admin = Depends(admin_only)):

#     total = logs_collection.count_documents({})
#     mask_count = logs_collection.count_documents({"status": "Mask"})
#     no_mask_count = logs_collection.count_documents({"status": "No Mask"})

#     return {
#         "total_detections": total,
#         "mask_detected": mask_count,
#         "no_mask_detected": no_mask_count,
#         "admin": current_admin["email"]
#     }
from fastapi import APIRouter, Depends
from database import logs_collection
from dependencies import get_current_user, admin_only
from bson import ObjectId

router = APIRouter()

# ==============================
# 👑 ADMIN DASHBOARD (FULL DATA)
# ==============================
@router.get("/admin-dashboard")
def admin_dashboard(current_admin = Depends(admin_only)):

    total = logs_collection.count_documents({})
    mask_count = logs_collection.count_documents({"status": "Mask"})
    no_mask_count = logs_collection.count_documents({"status": "No Mask"})

    # 🔥 GET ALL LOGS (latest first)
    logs_cursor = logs_collection.find().sort("timestamp",-1).limit(50)

    logs_list = []
    for log in logs_cursor:
        log["_id"] = str(log["_id"])  # convert ObjectId
        logs_list.append(log)

    return {
        "total_detections": total,
        "mask_detected": mask_count,
        "no_mask_detected": no_mask_count,
        "admin": current_admin["email"],
        "logs": logs_list
    }
# # # ===================================
# # # 👤 USER DASHBOARD (OWN DATA ONLY)
# # # ===================================
# @router.get("/user-dashboard")
# def user_dashboard(current_user = Depends(get_current_user)):

#     user_email = current_user["email"]

#     # total logs of this user
#     user_logs = logs_collection.count_documents({"email": user_email})

#     # mask count
#     mask_count = logs_collection.count_documents({
#         "email": user_email,
#         "status": "Mask"
#     })

#     # no mask count
#     no_mask_count = logs_collection.count_documents({
#         "email": user_email,
#         "status": "No Mask"
#     })

#     return {
#         "your_total_detections": user_logs,
#         "mask_detected": mask_count,
#         "no_mask_detected": no_mask_count,
#         "user": user_email
#     }
@router.get("/user-dashboard")
def user_dashboard(current_user = Depends(get_current_user)):

    user_email = current_user["email"]

    # total logs of this user
    user_logs = logs_collection.count_documents({"email": user_email})

    # mask count
    mask_count = logs_collection.count_documents({
        "email": user_email,
        "status": "Mask"
    })

    # no mask count
    no_mask_count = logs_collection.count_documents({
        "email": user_email,
        "status": "No Mask"
    })

    # 🔥 USER ONLY HIS LOGS (latest first)
    logs = list(
        logs_collection.find({"email": user_email})
        .sort("timestamp",-1)
        .limit(50)
    )

    for log in logs:
        log["_id"] = str(log["_id"])

    return {
        "your_total_detections": user_logs,
        "mask_detected": mask_count,
        "no_mask_detected": no_mask_count,
        "user": user_email,
        "logs": logs   # 🔥 SEND LOGS
    }
