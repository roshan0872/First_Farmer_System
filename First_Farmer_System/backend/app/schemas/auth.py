from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    confirm_password: str = Field(..., min_length=6, max_length=100)
    preferred_language: str = Field(default="en", max_length=10)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class PasswordChange(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6, max_length=100)
    confirm_new_password: str = Field(..., min_length=6, max_length=100)


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    preferred_language: Optional[str] = Field(None, max_length=10)


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    preferred_language: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    sub: Optional[str] = None
