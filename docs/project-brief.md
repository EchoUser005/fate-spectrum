# Project Brief

Fate Spectrum · 命运光谱 is an open-source BaZi/Ziwei report dashboard. It turns paipan JSON into explainable multidimensional life spectra for self-reflection, entertainment, and planning reference.

## Vision

Replace single-score destiny framing with a spectrum model: wealth, career, comfort, selfValue, relationship, healthEnergy, and riskControl can brighten or dim independently across dayun and yearly windows.

## Target Users

- People who already have birth data and want a structured report.
- Developers who own or can integrate paipan providers.
- Codex users collaborating through branch-based, spec-driven development.

## Core Flow

1. User enters birth data.
2. User enters model name/key.
3. System requests real paipan data and normalizes it internally.
4. Rule-based scoring engine computes dayun and yearly spectra.
5. BYOK model writes narrative explanations without changing scores.
6. UI renders charts, tables, palace summary, and exports.

## Non-Goals

- No database or history in MVP.
- No login, payment, or microservice split.
- No in-house full paipan algorithm.
- No medical, legal, investment, or psychological advice.
