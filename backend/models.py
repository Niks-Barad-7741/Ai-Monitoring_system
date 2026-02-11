from pydantic import BaseModel, EmailStr

# =========================
# User Register Model
# =========================
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str  # admin or user


# =========================
# User Login Model
# =========================
class UserLogin(BaseModel):
    email: EmailStr
    password: str
