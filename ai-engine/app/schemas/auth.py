from pydantic import BaseModel, EmailStr, Field

class SendCodeRequest(BaseModel):
    email: EmailStr = Field(..., description="用户邮箱")

class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=2, max_length=64, description="用户名")
    email: EmailStr = Field(..., description="用户邮箱")
    password: str = Field(..., min_length=6, description="密码")
    code: str = Field(..., min_length=6, max_length=6, description="验证码")

class LoginRequest(BaseModel):
    username: str = Field(..., description="用户名")
    password: str = Field(..., description="密码")
