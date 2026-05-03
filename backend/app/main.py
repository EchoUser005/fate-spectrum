from __future__ import annotations

from fastapi import FastAPI, HTTPException

from .schemas import ProfileSnapshot, ProfileUpsert, RollupMemory, WeeklyMemory
from .storage import (
    get_guest_profile,
    get_owner_profile,
    list_guest_profiles,
    list_profiles,
    save_profile_snapshot,
    save_rollup_memory,
    save_weekly_memory,
    upsert_guest_profile,
    upsert_owner_profile,
)


app = FastAPI(title="Fate Spectrum Memory API", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/profiles")
def profiles() -> dict[str, object]:
    return list_profiles()


@app.get("/profiles/owner")
def owner_profile() -> dict[str, object]:
    owner = get_owner_profile()
    if owner is None:
        raise HTTPException(status_code=404, detail="owner profile not found")
    return owner


@app.put("/profiles/owner")
def upsert_owner(profile: ProfileUpsert) -> dict[str, str]:
    return upsert_owner_profile(profile)


@app.get("/profiles/guests")
def guest_profiles() -> list[dict[str, object]]:
    return list_guest_profiles()


@app.post("/profiles/guests")
def create_guest(profile: ProfileUpsert) -> dict[str, str]:
    return upsert_guest_profile(profile)


@app.get("/profiles/guests/{guest_id}")
def guest_profile(guest_id: str) -> dict[str, object]:
    guest = get_guest_profile(guest_id)
    if guest is None:
        raise HTTPException(status_code=404, detail="guest profile not found")
    return guest


@app.post("/profiles/snapshots")
def create_profile_snapshot(snapshot: ProfileSnapshot) -> dict[str, str]:
    return save_profile_snapshot(snapshot)


@app.post("/memory/weekly")
def create_weekly_memory(memory: WeeklyMemory) -> dict[str, str]:
    return save_weekly_memory(memory)


@app.post("/memory/monthly")
def create_monthly_memory(memory: RollupMemory) -> dict[str, str]:
    return save_rollup_memory("monthly", memory)


@app.post("/memory/yearly")
def create_yearly_memory(memory: RollupMemory) -> dict[str, str]:
    return save_rollup_memory("yearly", memory)
