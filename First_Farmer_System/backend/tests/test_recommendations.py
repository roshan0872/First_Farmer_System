def test_crop_recommendation_matching(client):
    req_payload = {
        "region": "South India",
        "soil_type": "Clay",
        "season": "Kharif",
        "water_availability": "High",
        "temperature": 29.0
    }
    res = client.post("/api/recommendations", json=req_payload)
    assert res.status_code == 200
    data = res.json()
    assert "matches" in data
    assert len(data["matches"]) > 0

    top_match = data["matches"][0]
    # Under Clay + Kharif + High Water in South India, Rice should be top ranked
    assert top_match["crop"]["name"] == "Rice"
    assert top_match["match_score"] >= 80
    assert len(top_match["matched_criteria"]) > 0
    assert "educational_disclaimer" in data


def test_recommendation_low_water_dryland(client):
    req_payload = {
        "region": "South India",
        "soil_type": "Red soil",
        "season": "Kharif",
        "water_availability": "Low"
    }
    res = client.post("/api/recommendations", json=req_payload)
    assert res.status_code == 200
    data = res.json()
    crop_names = [m["crop"]["name"] for m in data["matches"][:3]]
    # Finger Millet (Ragi) or Groundnut should be near the top
    assert any("Millet" in name or "Groundnut" in name for name in crop_names)
