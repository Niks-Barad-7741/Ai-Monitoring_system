import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from jose import JWTError, jwt
import uuid

load_dotenv()

# secret keys loaded safely with fallback
SECRET_KEY = os.getenv("SECRET_KEY", "ai-monitoring-secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))


# 🔐 create access token (short-lived JWT)
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# 🔄 create refresh token (long-lived random UUID — stored in MongoDB)
def create_refresh_token():
    return str(uuid.uuid4())


# 🔓 verify access token
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
