from __future__ import annotations

from fastapi import FastAPI

from .schemas import ProfileSnapshot, RollupMemory, WeeklyMemory
from .storage import list_profiles, save_profile_snapshot, save_rollup_memory, save_weekly_memory


app = FastAPI(title="Fate Spectrum Memory API", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/profiles")
def profiles() -> dict[str, object]:
    return list_profiles()


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
