def test_chatbot_greeting(client):
    res = client.post("/api/chat", json={"message": "Hello there", "language": "en"})
    assert res.status_code == 200
    data = res.json()
    assert "First Farmer" in data["reply"]
    assert len(data["related_links"]) > 0


def test_chatbot_known_crop_question(client):
    res = client.post("/api/chat", json={"message": "Tell me about cultivating Tomato", "language": "en"})
    assert res.status_code == 200
    data = res.json()
    assert "Tomato" in data["reply"]
    assert any("/crops/4" in link["url"] or "cultivation" in link["url"] for link in data["related_links"])


def test_chatbot_unknown_honest_fallback(client):
    res = client.post("/api/chat", json={"message": "Can I grow space meteorites in soil?", "language": "en"})
    assert res.status_code == 200
    data = res.json()
    # Honest fallback informing user of verified topics without fabricating
    assert "could not locate a verified match" in data["reply"]
