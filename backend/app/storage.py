from __future__ import annotations

import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

from .schemas import ProfileRole, ProfileSnapshot, ProfileUpsert, RollupMemory, WeeklyMemory


def data_root() -> Path:
    return Path(os.getenv("FATE_DATA_DIR", "/data/fate-spectrum")).resolve()


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def write_markdown(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip() + "\n", encoding="utf-8")


def save_profile_snapshot(snapshot: ProfileSnapshot) -> dict[str, str]:
    profile_id = safe_id(snapshot.profile_id or snapshot.nickname or snapshot.role)
    if snapshot.role == "owner":
        profile_dir = data_root() / "owner"
    else:
        profile_dir = data_root() / "guests" / profile_id

    timestamp = safe_id(snapshot.generated_at or now_id())
    profile_payload = snapshot.model_dump(by_alias=True)
    write_json(profile_dir / "profile.json", profile_payload)
    write_json(profile_dir / "reports" / f"{timestamp}.json", profile_payload)
    write_markdown(profile_dir / "memory" / "index.md", build_profile_index(snapshot))
    return {"profileId": profile_id, "path": str(profile_dir)}


def upsert_owner_profile(profile: ProfileUpsert) -> dict[str, str]:
    return upsert_profile("owner", profile)


def upsert_guest_profile(profile: ProfileUpsert) -> dict[str, str]:
    return upsert_profile("guest", profile)


def upsert_profile(role: ProfileRole, profile: ProfileUpsert) -> dict[str, str]:
    profile_id = safe_id(profile.profile_id or profile.nickname or role)
    profile_dir = profile_directory(role, profile_id)
    payload = {
        "role": role,
        "profileId": profile_id,
        "nickname": profile.nickname,
        "birth": profile.birth,
        "notes": profile.notes,
        "updatedAt": now_id(),
    }
    existing = read_json(profile_dir / "profile.json") if (profile_dir / "profile.json").exists() else {}
    if isinstance(existing, dict) and "createdAt" in existing:
        payload["createdAt"] = existing["createdAt"]
    else:
        payload["createdAt"] = payload["updatedAt"]
    if isinstance(existing, dict):
        for key in ("generatedAt", "report"):
            if key in existing:
                payload[key] = existing[key]
    write_json(profile_dir / "profile.json", payload)
    write_markdown(profile_dir / "memory" / "index.md", build_profile_index_from_payload(payload))
    return {"profileId": profile_id, "path": str(profile_dir)}


def save_weekly_memory(memory: WeeklyMemory) -> dict[str, str]:
    week_dir = data_root() / "owner" / "memory" / "weekly" / safe_id(memory.week_id)
    payload = memory.model_dump(by_alias=True)
    write_json(week_dir / "weekly.json", payload)
    write_markdown(week_dir / "weekly.md", build_weekly_markdown(memory))
    return {"path": str(week_dir)}


def save_rollup_memory(kind: str, memory: RollupMemory) -> dict[str, str]:
    if kind not in {"monthly", "yearly"}:
        raise ValueError("kind must be monthly or yearly")
    rollup_dir = data_root() / "owner" / "memory" / kind / safe_id(memory.period)
    write_json(rollup_dir / f"{kind}.json", memory.model_dump(by_alias=True))
    write_markdown(rollup_dir / f"{kind}.md", memory.markdown)
    return {"path": str(rollup_dir)}


def list_profiles() -> dict[str, Any]:
    root = data_root()
    owner = root / "owner" / "profile.json"
    guests_dir = root / "guests"
    guests = []
    if guests_dir.exists():
        for profile_path in guests_dir.glob("*/profile.json"):
            guests.append(read_json(profile_path))
    return {
        "owner": read_json(owner) if owner.exists() else None,
        "guests": guests,
    }


def get_owner_profile() -> Optional[dict[str, Any]]:
    owner = data_root() / "owner" / "profile.json"
    return read_json(owner) if owner.exists() else None


def list_guest_profiles() -> list[dict[str, Any]]:
    guests_dir = data_root() / "guests"
    if not guests_dir.exists():
        return []
    return [
        read_json(profile_path)
        for profile_path in sorted(guests_dir.glob("*/profile.json"))
    ]


def get_guest_profile(guest_id: str) -> Optional[dict[str, Any]]:
    profile_path = profile_directory("guest", safe_id(guest_id)) / "profile.json"
    return read_json(profile_path) if profile_path.exists() else None


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def build_profile_index(snapshot: ProfileSnapshot) -> str:
    nickname = snapshot.nickname or ("命主" if snapshot.role == "owner" else "缘主")
    return "\n".join(
        [
            f"# {nickname}",
            "",
            f"- 角色：{'命主' if snapshot.role == 'owner' else '缘主'}",
            f"- 最近生成：{snapshot.generated_at}",
            "- 说明：这里沉淀命盘、周报、月报、年报和长期记忆索引。",
        ]
    )


def build_profile_index_from_payload(payload: dict[str, Any]) -> str:
    role = payload.get("role")
    nickname = payload.get("nickname") or ("命主" if role == "owner" else "缘主")
    return "\n".join(
        [
            f"# {nickname}",
            "",
            f"- 角色：{'命主' if role == 'owner' else '缘主'}",
            f"- 最近更新：{payload.get('updatedAt', '')}",
            "- 说明：这里沉淀命盘、周报、月报、年报和长期记忆索引。",
        ]
    )


def build_weekly_markdown(memory: WeeklyMemory) -> str:
    lines = [f"# {memory.title}", "", memory.summary, ""]
    for day in memory.days:
        lines.extend(
            [
                f"## {day.date} {day.weekday} {day.ganzhi}({day.energy_tag}) -【{day.theme}】",
                "",
                f"分析: {day.analysis}",
                "",
                f"建议: {day.advice}",
                "",
            ]
        )
    if memory.key_events:
        lines.extend(["## 关键事件", ""])
        lines.extend([f"- {event}" for event in memory.key_events])
        lines.append("")
    if memory.next_week_preview:
        lines.extend(["## 总结展望", "", memory.next_week_preview, ""])
    return "\n".join(lines)


def now_id() -> str:
    return datetime.now(timezone.utc).isoformat()


def safe_id(value: str) -> str:
    cleaned = re.sub(r"[^\w.-]+", "-", value.strip(), flags=re.UNICODE)
    return cleaned.strip("-")[:96] or "default"


def profile_directory(role: ProfileRole, profile_id: str) -> Path:
    if role == "owner":
        return data_root() / "owner"
    return data_root() / "guests" / safe_id(profile_id)
