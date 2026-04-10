from pydantic import BaseModel, EmailStr

# =========================
# User Register Model
# =========================
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "user"  # defaults to user for public registration


# =========================
# User Login Model
# =========================
class UserLogin(BaseModel):
    email: EmailStr
    password: str
