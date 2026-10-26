def test_weather_educational_fallback(client):
    res = client.get("/api/weather?location=Coimbatore")
    assert res.status_code == 200
    data = res.json()
    assert "location" in data
    assert "temperature" in data
    assert "agricultural_advisory" in data
    # When no live key is set, is_sample_data should be True and notice should clearly state it
    assert data["is_sample_data"] is True
    assert "not configured" in data["notice_message"]
