from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.session import Base


class CropBookmark(Base):
    __tablename__ = "crop_bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    crop_id = Column(Integer, ForeignKey("crops.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="bookmarks")
    crop = relationship("Crop", back_populates="bookmarks")

    __table_args__ = (
        UniqueConstraint("user_id", "crop_id", name="uq_user_crop_bookmark"),
    )


class LearningProgress(Base):
    __tablename__ = "learning_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    crop_id = Column(Integer, ForeignKey("crops.id", ondelete="CASCADE"), nullable=True)
    module_name = Column(String(100), nullable=False)  # e.g., "cultivation", "pest_management", "harvest", "post_harvest"
    completion_status = Column(String(50), default="in_progress", nullable=False)  # "in_progress", "completed"
    progress_percentage = Column(Integer, default=0, nullable=False)
    last_accessed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="learning_progress")
    crop = relationship("Crop", back_populates="learning_progress")

    __table_args__ = (
        UniqueConstraint("user_id", "crop_id", "module_name", name="uq_user_crop_module_progress"),
    )
