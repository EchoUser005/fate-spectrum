## Why

Public demo feedback shows the product still feels like a paipan/debug dashboard rather than a consumer-facing life spectrum product. Too much visible priority is given to raw JSON, data provenance, and specialist terms; users need outcomes, timing, trade-offs, and next actions first. DeepSeek defaults also need to follow the current official V4 API model names, and BYOK entry should be less repetitive by caching keys in the browser session.

## What Changes

- Reframe the homepage and report around user outcomes: current profile, near-term rhythm, opportunity/risk windows, and suggested actions.
- Demote raw paipan JSON, BaZi pillars, and Ziwei palace data into optional advanced/source sections instead of primary report content.
- Use community chart components already in the stack, especially Recharts/shadcn-chart patterns, for radar/radial/line visualizations instead of hand-built visual blocks.
- Update DeepSeek defaults from `deepseek-chat` to V4 model ids and explain how to apply for a DeepSeek API key.
- Cache user-entered LLM keys in browser session storage only, with clear copy and a clear action.
- Update tests, docs, devlog, handoff, TODO, and test matrix.

## Capabilities

### Modified Capabilities

- `product`: Outcome-first product language and lower prominence for raw technical materials.
- `ui-dashboard`: Community-chart-backed report composition, advanced source panels, and user-first report hierarchy.
- `llm-provider`: DeepSeek V4 defaults, key application guidance, and session key reuse.
- `security`: Browser-session-only key caching boundaries and clear-key behavior.

## Impact

- Touches dashboard components, provider form behavior, LLM preset defaults, tests, and docs.
- Keeps the existing stateless API and BYOK server boundary.
- Does not add a database, account system, persistent key storage, or a new visualization dependency unless existing Recharts cannot cover the design.
