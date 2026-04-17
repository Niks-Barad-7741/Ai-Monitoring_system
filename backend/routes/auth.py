from fastapi import APIRouter, HTTPException
from database import users_collection, refresh_tokens_collection
from models import UserRegister, UserLogin
from passlib.context import CryptContext
from datetime import datetime, timedelta
from active_users import add_user, remove_user
from security import create_access_token, create_refresh_token, REFRESH_TOKEN_EXPIRE_DAYS
import re
import hashlib

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# =========================
#  HELPER — hash + save refresh token to MongoDB
# =========================
def hash_token(token: str) -> str:
    """SHA256 hash so plain token is never stored in DB"""
    return hashlib.sha256(token.encode()).hexdigest()

def save_refresh_token(email: str, token: str):
    # 🧹 Delete any old refresh tokens for this user (prevents accumulation)
    refresh_tokens_collection.delete_many({"email": email})
    # 🔒 Store only the hashed version
    refresh_tokens_collection.insert_one({
        "token": hash_token(token),
        "email": email,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    })


# =========================
#  REGISTER API
# =========================
@router.post("/register")
def register_user(user: UserRegister):

    if not user.name or not user.name.strip():
        raise HTTPException(status_code=400,detail="Name Cannot Be Empty")

    #  NAME VALIDATION
    if not user.name or len(user.name.strip()) < 4:
        raise HTTPException(status_code=400, detail="Name must be at least 6 characters")

    #  EMAIL REGEX VALIDATION
    email_regex = r'^[a-zA-Z0-9._%+-]+@gmail\.com$'
    if not re.match(email_regex, user.email):
        raise HTTPException(status_code=400, detail="Invalid email format (Only @gmail.com is allowed)")

    #  PASSWORD VALIDATION
    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    #  CHECK EXISTING EMAIL
    existing = users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    #  HASH PASSWORD
    hashed_password = pwd_context.hash(user.password)

    new_user = {
        "name": user.name.strip(),
        "email": user.email.strip(),
        "password": hashed_password,
        "role": "user",  # Force public registrations to be "user"
        "is_blocked": False,
        "created_at": datetime.utcnow()
    }

    users_collection.insert_one(new_user)

    #  CREATE TOKENS DURING REGISTER
    access_token = create_access_token({
        "email": user.email,
        "role": user.role,
        "name": user.name
    })
    refresh_token = create_refresh_token()
    save_refresh_token(user.email, refresh_token)

    return {
        "message": "User registered successfully",
        "token": access_token,
        "refresh_token": refresh_token
    }


@router.post("/login")
def login_user(user: UserLogin):

    db_user = users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if db_user.get("is_blocked", False):
        raise HTTPException(status_code=403, detail="Your account has been blocked")

    if not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    #  CREATE ACCESS + REFRESH TOKEN
    access_token = create_access_token({
        "email": db_user["email"],
        "role": db_user["role"],
        "name": db_user["name"]
    })
    refresh_token = create_refresh_token()
    save_refresh_token(db_user["email"], refresh_token)

    #  ADD ACTIVE USER
    add_user(db_user["email"])

    return {
        "message": "Login successful",
        "token": access_token,
        "refresh_token": refresh_token,
        "email": db_user["email"],
        "role": db_user["role"],
        "name": db_user["name"]
    }

@router.post("/logout")
def logout_user(data: dict):

    email = data.get("email")
    refresh_token = data.get("refresh_token")

    if email:
        remove_user(email)

    # 🗑️ Delete refresh token from MongoDB (revoke it)
    if refresh_token:
        refresh_tokens_collection.delete_one({"token": hash_token(refresh_token)})
    elif email:
        # If no specific token provided, delete all tokens for this user
        refresh_tokens_collection.delete_many({"email": email})

    return {"message": "Logged out"}


# =========================
#  REFRESH TOKEN (Silent Re-auth)
# =========================
@router.post("/refresh")
def refresh_access_token(data: dict):

    refresh_token = data.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=400, detail="Refresh token is required")

    #  Look up refresh token in MongoDB (hash it first to compare)
    hashed = hash_token(refresh_token)
    stored = refresh_tokens_collection.find_one({"token": hashed})

    if not stored:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    #  Check if refresh token has expired
    if stored["expires_at"] < datetime.utcnow():
        refresh_tokens_collection.delete_one({"token": hashed})
        raise HTTPException(status_code=401, detail="Refresh token expired")

    #  Get the user from DB
    user = users_collection.find_one({"email": stored["email"]})
    if not user:
        refresh_tokens_collection.delete_one({"token": refresh_token})
        raise HTTPException(status_code=404, detail="User not found")

    #  Generate fresh access token
    new_access_token = create_access_token({
        "email": user["email"],
        "role": user["role"],
        "name": user["name"]
    })

    return {
        "token": new_access_token,
        "message": "Token refreshed successfully"
    }


# =========================
#  VERIFY EMAIL (Forgot Password Step 1)
# =========================
@router.post("/verify-email")
def verify_email(data: dict):
    email = data.get("email", "").strip().lower()

    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email")

    return {"message": "Email verified successfully"}


# =========================
#  RESET PASSWORD (Forgot Password Step 2)
# =========================
@router.post("/reset-password")
def reset_password(data: dict):
    email        = data.get("email", "").strip().lower()
    new_password = data.get("new_password", "")

    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    if not new_password or len(new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email")

    hashed = pwd_context.hash(new_password)

    users_collection.update_one(
        {"email": email},
        {"$set": {"password": hashed}}
    )

    return {"message": "Password reset successfully"}