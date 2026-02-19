from fastapi import APIRouter, HTTPException
from database import users_collection
from models import UserRegister, UserLogin
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from active_users import add_user,remove_user
from security import SECRET_KEY
import re

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# =========================
#  CREATE TOKEN
# =========================
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token


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
    email_regex = r'^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$'
    if not re.match(email_regex, user.email):
        raise HTTPException(status_code=400, detail="Invalid email format")

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
        "role": user.role,
        "created_at": datetime.utcnow()
    }

    users_collection.insert_one(new_user)

    #  CREATE TOKEN ALSO DURING REGISTER
    token = create_access_token({
        "email": user.email,
        "role": user.role,
        "name": user.name
    })

    return {
        "message": "User registered successfully",
        "token": token   # ← token created but no auto login
    }


@router.post("/login")
def login_user(user: UserLogin):

    db_user = users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    #  CREATE JWT TOKEN
    token = create_access_token({
        "email": db_user["email"],
        "role": db_user["role"],
        "name": db_user["name"]
    })

    #  ADD ACTIVE USER
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
