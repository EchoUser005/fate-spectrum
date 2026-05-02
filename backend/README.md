# Fate Spectrum Memory API

This FastAPI service is intentionally small: it stores owner, guest, weekly, monthly, and yearly memory artifacts as JSON/Markdown files.

Default storage root:

```bash
FATE_DATA_DIR=/data/fate-spectrum
```

Local run:

```bash
cd backend
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Main paths:

- `POST /profiles/snapshots`: persist 命主 or 缘主 report snapshots.
- `POST /memory/weekly`: store weekly daily-flow reports.
- `POST /memory/monthly`: roll weekly reports into monthly memory.
- `POST /memory/yearly`: roll monthly reports into yearly memory.

Do not commit the generated `data/` directory. It is private user memory.
