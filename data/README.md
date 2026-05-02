# Local Data Directory

Runtime memory files live here only when you run the project outside Docker and point `FATE_DATA_DIR` at this repository.

Suggested structure:

```text
data/
  owner/
    profile.json
    reports/
    memory/
      index.md
      weekly/
      monthly/
      yearly/
  guests/
    <guest-id>/
      profile.json
      reports/
```

Generated owner and guest data is private and ignored by Git.
