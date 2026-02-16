from fastapi import APIRouter, HTTPException
from database import users_collection
from models import UserRegister, UserLogin
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from active_users import add_user,remove_user
from security import SECRET_KEY

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# =========================
# 🔐 TOKEN SETTINGS
# =========================
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token


# =========================
# 🔐 REGISTER API
# =========================
@router.post("/register")
def register_user(user: UserRegister):

    existing = users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = pwd_context.hash(user.password)

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": user.role,
        "created_at": datetime.utcnow()
    }

    users_collection.insert_one(new_user)

    return {"message": "User registered successfully"}


# =========================
# 🔐 LOGIN API WITH TOKEN
# =========================
# @router.post("/login")
# def login_user(user: UserLogin):

#     db_user = users_collection.find_one({"email": user.email})
#     if not db_user:
#         raise HTTPException(status_code=404, detail="User not found")

#     if not pwd_context.verify(user.password, db_user["password"]):
#         raise HTTPException(status_code=401, detail="Invalid password")

#     # 🎯 CREATE JWT TOKEN
#     token = create_access_token({
#         "email": db_user["email"],
#         "role": db_user["role"],
#         "name": db_user["name"]
#     })

#     return {
#         "message": "Login successful",
#         "token": token,
#         "email": db_user["email"],
#         "role": db_user["role"],
#         "name": db_user["name"]
#     }
@router.post("/login")
def login_user(user: UserLogin):

    db_user = users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    # 🎯 CREATE JWT TOKEN
    token = create_access_token({
        "email": db_user["email"],
        "role": db_user["role"],
        "name": db_user["name"]
    })

    # 🟢 ADD ACTIVE USER
    add_user(db_user["email"])

    return {
        "message": "Login successful",
        "token": token,
        "email": db_user["email"],
        "role": db_user["role"],
        "name": db_user["name"]
    }

@router.post("/logout")
def logout_user(data: dict):

    email = data.get("email")

    if email:
        remove_user(email)

    return {"message":"Logged out"}