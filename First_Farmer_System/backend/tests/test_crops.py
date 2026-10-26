def test_get_crops_list(client):
    res = client.get("/api/crops")
    assert res.status_code == 200
    crops = res.json()
    assert len(crops) >= 10
    names = [c["name"] for c in crops]
    assert "Rice" in names
    assert "Tomato" in names
    assert "Wheat" in names


def test_search_and_filter_crops(client):
    # Search for 'Oryza' or 'Rice'
    res = client.get("/api/crops?search=Rice")
    assert res.status_code == 200
    crops = res.json()
    assert any(c["name"] == "Rice" for c in crops)

    # Filter by category Cereal
    res_cat = client.get("/api/crops?category=Cereal")
    assert res_cat.status_code == 200
    cereals = res_cat.json()
    assert all("Cereal" in c["category"] for c in cereals)


def test_crop_detail_with_guides(client):
    # Fetch Rice (ID: 1)
    res = client.get("/api/crops/1")
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Rice"
    assert data["cultivation_guide"] is not None
    assert len(data["pest_diseases"]) > 0
    assert data["harvest_guide"] is not None
    assert data["post_harvest_guide"] is not None
    assert len(data["products"]) > 0


def test_admin_only_crop_operations(client, student_token, admin_token):
    # Student should be forbidden from creating crop
    crop_payload = {
        "name": "Barley Test",
        "scientific_name": "Hordeum vulgare",
        "category": "Cereal",
        "description": "Test crop description.",
        "suitable_regions": "North India",
        "soil_requirements": "Loamy",
        "climate_requirements": "Cool",
        "season": "Rabi",
        "water_requirement": "Low",
        "difficulty_level": "Beginner",
        "is_published": True
    }

    res_student = client.post(
        "/api/crops",
        json=crop_payload,
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert res_student.status_code == 403

    # Admin should succeed
    res_admin = client.post(
        "/api/crops",
        json=crop_payload,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res_admin.status_code == 201
    created_id = res_admin.json()["id"]

    # Clean up test crop
    del_res = client.delete(
        f"/api/crops/{created_id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert del_res.status_code == 200
