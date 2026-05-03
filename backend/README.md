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

Local backend tests:

```bash
pip install -r requirements.txt -r requirements-dev.txt
PYTHONPATH=backend python -m pytest backend/tests
```

Maintainers may use any isolated Python environment, including venv, uv, or conda. Do not document machine-specific conda paths as the project standard; Docker and `requirements.txt` are the portable contract.

Main paths:

- `PUT /profiles/owner`: create or update the single 命主 profile.
- `GET /profiles/owner`: read 命主 profile.
- `POST /profiles/guests`: add a 缘主 profile.
- `GET /profiles/guests`: list 缘主 profiles.
- `GET /profiles/guests/{guest_id}`: read one 缘主 profile.
- `POST /profiles/snapshots`: persist 命主 or 缘主 report snapshots.
- `POST /memory/weekly`: store weekly daily-flow reports.
- `POST /memory/monthly`: roll weekly reports into monthly memory.
- `POST /memory/yearly`: roll monthly reports into yearly memory.

Do not commit the generated `data/` directory. It is private user memory.
