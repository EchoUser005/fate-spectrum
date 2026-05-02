from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


ProfileRole = Literal["owner", "guest"]


class ProfileSnapshot(BaseModel):
    role: ProfileRole = "owner"
    profile_id: str | None = Field(default=None, alias="profileId")
    nickname: str | None = None
    generated_at: str = Field(alias="generatedAt")
    report: dict[str, Any]


class DailyFlow(BaseModel):
    date: str
    weekday: str
    ganzhi: str
    theme: str
    energy_tag: str = Field(alias="energyTag")
    analysis: str
    advice: str


class WeeklyMemory(BaseModel):
    profile_id: str = Field(alias="profileId")
    week_id: str = Field(alias="weekId")
    title: str
    summary: str
    days: list[DailyFlow]
    key_events: list[str] = Field(default_factory=list, alias="keyEvents")
    next_week_preview: str = Field(default="", alias="nextWeekPreview")


class RollupMemory(BaseModel):
    profile_id: str = Field(alias="profileId")
    period: str
    title: str
    markdown: str
    source_ids: list[str] = Field(default_factory=list, alias="sourceIds")
