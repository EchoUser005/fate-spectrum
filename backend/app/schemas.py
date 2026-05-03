from __future__ import annotations

from typing import Any, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


ProfileRole = Literal["owner", "guest"]


class ProfileSnapshot(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    role: ProfileRole = "owner"
    profile_id: Optional[str] = Field(default=None, alias="profileId")
    nickname: Optional[str] = None
    generated_at: str = Field(alias="generatedAt")
    report: dict[str, Any]


class ProfileUpsert(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    profile_id: Optional[str] = Field(default=None, alias="profileId")
    nickname: str
    birth: dict[str, Any] = Field(default_factory=dict)
    notes: str = ""


class DailyFlow(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    date: str
    weekday: str
    ganzhi: str
    theme: str
    energy_tag: str = Field(alias="energyTag")
    analysis: str
    advice: str


class WeeklyMemory(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    profile_id: str = Field(alias="profileId")
    week_id: str = Field(alias="weekId")
    title: str
    summary: str
    days: list[DailyFlow]
    key_events: list[str] = Field(default_factory=list, alias="keyEvents")
    next_week_preview: str = Field(default="", alias="nextWeekPreview")


class RollupMemory(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    profile_id: str = Field(alias="profileId")
    period: str
    title: str
    markdown: str
    source_ids: list[str] = Field(default_factory=list, alias="sourceIds")
