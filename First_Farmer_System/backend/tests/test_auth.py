import uuid


def test_login_success(client):
    res = client.post(
        "/api/auth/login",
        json={"email": "student@firstfarmer.org", "password": "Student@123"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "student@firstfarmer.org"


def test_login_failure_generic_message(client):
    res = client.post(
        "/api/auth/login",
        json={"email": "nonexistent@firstfarmer.org", "password": "wrongpassword"}
    )
    assert res.status_code == 401
    assert "Invalid email or password" in res.json()["detail"]


def test_registration_and_duplicate_rejection(client):
    unique_email = f"user_{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "full_name": "Test Farmer",
        "email": unique_email,
        "password": "Password123",
        "confirm_password": "Password123",
        "preferred_language": "en"
    }

    # First registration should succeed
    res1 = client.post("/api/auth/register", json=payload)
    assert res1.status_code == 201
    assert "access_token" in res1.json()

    # Second registration with same email must fail
    res2 = client.post("/api/auth/register", json=payload)
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"]


def test_protected_route_without_token(client):
    res = client.get("/api/auth/me")
    assert res.status_code == 401


def test_protected_route_with_token(client, student_token):
    res = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert res.status_code == 200
    assert res.json()["email"] == "student@firstfarmer.org"
