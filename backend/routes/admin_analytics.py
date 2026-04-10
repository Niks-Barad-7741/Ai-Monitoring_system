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
#  ADMIN ANALYTICS API
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
    
    #  Count only TODAY's detections using regex
    today_count = collection.count_documents({
        "timestamp": {"$regex": f"^{today_str}"}  # Matches "2026-02-19_..."
    })
    
    #  Today's webcam detections only
    webcam_today = collection.count_documents({
        "source": "webcam",
        "timestamp": {"$regex": f"^{today_str}"}
    })
    
    #  Today's upload detections only
    upload_today = collection.count_documents({
        "source": "upload",
        "timestamp": {"$regex": f"^{today_str}"}
    })

    return {
        "total": total,
        "mask": mask,
        "no_mask": no_mask,
        "webcam": webcam_today,  #  Only today
        "upload": upload_today,  #  Only today
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


# =============================================================
#   USER MANAGEMENT ROUTES (Admin Only)
# =============================================================
from fastapi import HTTPException
from database import users_collection
from dependencies import admin_only
from models import UserRegister
from passlib.context import CryptContext

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.get("/manage-users")
def get_all_users(current_admin=Depends(admin_only)):
    users = list(users_collection.find({}, {"password": 0, "_id": 0}))
    return {"users": users}


@router.post("/manage-users/toggle-block")
def toggle_block(data: dict, current_admin=Depends(admin_only)):
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    if email == current_admin["email"]:
        raise HTTPException(status_code=400, detail="You cannot block your own account")

    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_status = not user.get("is_blocked", False)
    users_collection.update_one({"email": email}, {"$set": {"is_blocked": new_status}})
    return {"message": f"User {'blocked' if new_status else 'unblocked'} successfully", "is_blocked": new_status}


@router.post("/manage-users/update-role")
def update_role(data: dict, current_admin=Depends(admin_only)):
    email = data.get("email")
    new_role = data.get("role")
    if not email or not new_role:
        raise HTTPException(status_code=400, detail="Email and role are required")
    if new_role not in ["admin", "user"]:
        raise HTTPException(status_code=400, detail="Invalid role specified")
    if email == current_admin["email"]:
        raise HTTPException(status_code=400, detail="You cannot change your own role")

    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    users_collection.update_one({"email": email}, {"$set": {"role": new_role}})
    return {"message": "User role updated successfully", "role": new_role}


@router.delete("/manage-users/{email}")
def delete_user(email: str, current_admin=Depends(admin_only)):
    if email == current_admin["email"]:
        raise HTTPException(status_code=400, detail="You cannot delete your own account")
    result = users_collection.delete_one({"email": email})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}


@router.post("/manage-users/create")
def create_user(user: UserRegister, current_admin=Depends(admin_only)):
    if not user.name or not user.name.strip():
        raise HTTPException(status_code=400, detail="Name Cannot Be Empty")
    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    if user.role not in ["admin", "user"]:
        raise HTTPException(status_code=400, detail="Invalid role specified")

    clean_email = user.email.strip().lower()
    if users_collection.find_one({"email": clean_email}):
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = {
        "name": user.name.strip(),
        "email": clean_email,
        "password": _pwd_context.hash(user.password),
        "role": user.role,
        "is_blocked": False,
        "created_at": datetime.now(timezone.utc)
    }
    users_collection.insert_one(new_user)
    return {"message": "User created successfully"}