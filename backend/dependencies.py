from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from security import verify_token
from database import users_collection

security = HTTPBearer()

# 🔐 get current logged user from token
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = users_collection.find_one({"email": payload["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
# 👑 admin only access
def admin_only(current_user = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
# 👤 user only access
def user_only(current_user = Depends(get_current_user)):
    if current_user["role"] != "user":
        raise HTTPException(status_code=403, detail="User access required")
    return current_user
