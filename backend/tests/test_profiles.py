from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app


def test_owner_and_guest_profile_flow(tmp_path, monkeypatch):
    monkeypatch.setenv("FATE_DATA_DIR", str(tmp_path))
    client = TestClient(app)

    owner_response = client.put(
        "/profiles/owner",
        json={
            "nickname": "echo",
            "birth": {"calendar": "solar"},
            "notes": "主命盘",
        },
    )
    assert owner_response.status_code == 200
    assert owner_response.json()["profileId"] == "echo"

    guest_a = client.post(
        "/profiles/guests",
        json={
            "nickname": "朋友A",
            "birth": {"calendar": "solar"},
            "notes": "关系观察",
        },
    )
    guest_b = client.post(
        "/profiles/guests",
        json={
            "profileId": "guest-b",
            "nickname": "朋友B",
            "birth": {"calendar": "solar"},
        },
    )
    assert guest_a.status_code == 200
    assert guest_b.status_code == 200

    profiles = client.get("/profiles").json()
    assert profiles["owner"]["nickname"] == "echo"
    assert [guest["nickname"] for guest in profiles["guests"]] == ["朋友A", "朋友B"]

    assert client.get("/profiles/owner").json()["role"] == "owner"
    assert client.get("/profiles/guests").json()[0]["role"] == "guest"
    assert client.get("/profiles/guests/guest-b").json()["nickname"] == "朋友B"

    assert (tmp_path / "owner" / "profile.json").exists()
    assert (tmp_path / "guests" / "朋友A" / "profile.json").exists()
    assert (tmp_path / "guests" / "guest-b" / "profile.json").exists()


def test_profile_upsert_preserves_existing_report_snapshot(tmp_path, monkeypatch):
    monkeypatch.setenv("FATE_DATA_DIR", str(tmp_path))
    client = TestClient(app)

    snapshot_response = client.post(
        "/profiles/snapshots",
        json={
            "role": "owner",
            "profileId": "echo",
            "nickname": "echo",
            "generatedAt": "2026-05-03T00:00:00.000Z",
            "report": {"meta": {"generatedAt": "2026-05-03T00:00:00.000Z"}},
        },
    )
    assert snapshot_response.status_code == 200

    upsert_response = client.put(
        "/profiles/owner",
        json={
            "profileId": "echo",
            "nickname": "echo",
            "birth": {"calendar": "solar"},
            "notes": "补充资料",
        },
    )
    assert upsert_response.status_code == 200

    owner = client.get("/profiles/owner").json()
    assert owner["notes"] == "补充资料"
    assert owner["generatedAt"] == "2026-05-03T00:00:00.000Z"
    assert owner["report"]["meta"]["generatedAt"] == "2026-05-03T00:00:00.000Z"
