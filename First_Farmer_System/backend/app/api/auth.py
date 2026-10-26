from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    UserResponse,
    Token,
    UserUpdate,
    PasswordChange,
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    if user_in.password != user_in.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match",
        )
    
    if len(user_in.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long",
        )

    existing_user = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists",
        )

    # First user or specific pattern can be admin if no users exist, or default to student
    count = db.query(User).count()
    role = "admin" if count == 0 else "student"

    new_user = User(
        full_name=user_in.full_name.strip(),
        email=user_in.email.lower().strip(),
        password_hash=get_password_hash(user_in.password),
        role=role,
        preferred_language=user_in.preferred_language or "en",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(subject=new_user.id)
    return Token(access_token=token, token_type="bearer", user=UserResponse.model_validate(new_user))


@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email.lower().strip()).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        # Generic error message to prevent account enumeration
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(subject=user.id)
    return Token(access_token=token, token_type="bearer", user=UserResponse.model_validate(user))


@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.put("/me", response_model=UserResponse)
def update_profile(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name.strip()
    if user_update.preferred_language is not None:
        current_user.preferred_language = user_update.preferred_language.strip()
    
    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)


@router.post("/change-password")
def change_password(
    data: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(data.old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect existing password",
        )
    
    if data.new_password != data.confirm_new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New passwords do not match",
        )

    if len(data.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long",
        )

    current_user.password_hash = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}
