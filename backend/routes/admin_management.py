from fastapi import APIRouter, HTTPException, Depends
from database import users_collection
from dependencies import admin_only
from models import UserRegister
from passlib.context import CryptContext
from datetime import datetime

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# =========================
#  GET ALL USERS
# =========================
@router.get("/users")
def get_all_users(current_admin = Depends(admin_only)):
    # Return all users but exclude passwords
    users = list(users_collection.find({}, {"password": 0, "_id": 0}))
    return {"users": users}

# =========================
#  TOGGLE BLOCK STATUS
# =========================
@router.post("/users/toggle-block")
def toggle_block(data: dict, current_admin = Depends(admin_only)):
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
        
    # Standard security measure: Don't allow an admin to block themselves (prevent accidental lockouts)
    if email == current_admin["email"]:
        raise HTTPException(status_code=400, detail="You cannot block your own account")

    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    current_status = user.get("is_blocked", False)
    new_status = not current_status
    
    users_collection.update_one(
        {"email": email},
        {"$set": {"is_blocked": new_status}}
    )
    
    return {"message": f"User {'blocked' if new_status else 'unblocked'} successfully", "is_blocked": new_status}

# =========================
#  UPDATE ROLE
# =========================
@router.post("/users/update-role")
def update_role(data: dict, current_admin = Depends(admin_only)):
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
        
    users_collection.update_one(
        {"email": email},
        {"$set": {"role": new_role}}
    )
    
    return {"message": "User role updated successfully", "role": new_role}

# =========================
#  DELETE USER
# =========================
@router.delete("/users/{email}")
def delete_user(email: str, current_admin = Depends(admin_only)):
    if email == current_admin["email"]:
        raise HTTPException(status_code=400, detail="You cannot delete your own account")

    result = users_collection.delete_one({"email": email})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"message": "User deleted successfully"}

# =========================
#  CREATE USER (ADMIN ONLY)
# =========================
@router.post("/users/create")
def create_user(user: UserRegister, current_admin = Depends(admin_only)):
    if not user.name or not user.name.strip():
        raise HTTPException(status_code=400, detail="Name Cannot Be Empty")

    if not user.email.strip():
        raise HTTPException(status_code=400, detail="Email Cannot Be Empty")

    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        
    if user.role not in ["admin", "user"]:
        raise HTTPException(status_code=400, detail="Invalid role specified")

    # Lowercase email and check if exists
    clean_email = user.email.strip().lower()
    existing = users_collection.find_one({"email": clean_email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = pwd_context.hash(user.password)

    new_user = {
        "name": user.name.strip(),
        "email": clean_email,
        "password": hashed_password,
        "role": user.role,
        "is_blocked": False,
        "created_at": datetime.utcnow()
    }

    users_collection.insert_one(new_user)
    
    return {"message": "User created successfully"}
