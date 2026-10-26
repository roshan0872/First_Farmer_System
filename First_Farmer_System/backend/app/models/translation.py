from sqlalchemy import Column, Integer, String, Text, UniqueConstraint
from app.db.session import Base


class Translation(Base):
    __tablename__ = "translations"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(50), nullable=False)  # "crop", "guide", "ui"
    entity_id = Column(String(100), nullable=False)  # crop_id or translation key
    language_code = Column(String(10), nullable=False)  # "ta", "hi"
    translated_title = Column(String(255), nullable=True)
    translated_content = Column(Text, nullable=False)

    __table_args__ = (
        UniqueConstraint("entity_type", "entity_id", "language_code", name="uq_translation_entity_lang"),
    )
