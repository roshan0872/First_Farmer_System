import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import create_access_token


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="session")
def admin_token():
    db = SessionLocal()
    admin = db.query(User).filter(User.role == "admin").first()
    db.close()
    if admin:
        return create_access_token(subject=admin.id)
    return ""


@pytest.fixture(scope="session")
def student_token():
    db = SessionLocal()
    student = db.query(User).filter(User.role == "student").first()
    db.close()
    if student:
        return create_access_token(subject=student.id)
    return ""
