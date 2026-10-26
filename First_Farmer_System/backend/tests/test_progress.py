def test_bookmark_lifecycle(client, student_token):
    headers = {"Authorization": f"Bearer {student_token}"}

    # Add bookmark for Crop 1 (Rice)
    res_add = client.post("/api/bookmarks/1", headers=headers)
    assert res_add.status_code in [200, 201]

    # List bookmarks
    res_list = client.get("/api/bookmarks", headers=headers)
    assert res_list.status_code == 200
    assert any(b["crop_id"] == 1 for b in res_list.json())

    # Delete bookmark
    res_del = client.delete("/api/bookmarks/1", headers=headers)
    assert res_del.status_code == 200


def test_learning_progress_tracking(client, student_token):
    headers = {"Authorization": f"Bearer {student_token}"}

    progress_payload = {
        "crop_id": 1,
        "module_name": "cultivation",
        "completion_status": "completed",
        "progress_percentage": 100
    }
    res = client.post("/api/progress", json=progress_payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["module_name"] == "cultivation"
    assert data["completion_status"] == "completed"

    # Verify dashboard stats
    stats_res = client.get("/api/progress/stats", headers=headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_crops_in_library"] >= 10
    assert stats["completed_modules_count"] >= 1
