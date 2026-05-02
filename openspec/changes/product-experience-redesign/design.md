## Context

The current UI is technically complete but too source-data oriented. The user journey starts with provider mechanics and ends with raw chart data. That is useful for developers, but public-demo users want a product that answers: what is my current pattern, where are the next windows, what should I do, and what should I avoid?

## Frontend Direction

- **Visual thesis:** calm editorial cockpit with one strong spectrum map, dense but readable insight panels, and source data tucked behind advanced disclosure.
- **Content plan:** first screen asks for birth input and starts the experience; report opens with outcome summary, next windows, action plan, then deeper spectrum charts, then optional source data.
- **Interaction thesis:** generated report reveals from outcome to detail, chart controls filter dimensions, and advanced data opens only when requested.

## Design Decisions

1. **Outcome-first hierarchy**
   - The report starts with user-facing insight cards and action plan rather than BaZi/Ziwei/raw JSON.
   - Specialist labels can remain in advanced/source areas but should not dominate headings or first-read copy.

2. **Use existing community chart stack**
   - The repo already uses Recharts, and shadcn chart docs recommend building chart components on top of Recharts composition.
   - Add radar/radial-style Recharts views for dimension shape and timing instead of custom visual bars where practical.

3. **DeepSeek V4 defaults**
   - Official DeepSeek docs list `deepseek-v4-flash` and `deepseek-v4-pro` as V4 API model ids.
   - `deepseek-chat` is a legacy compatibility alias and should not be the default.

4. **Session key cache**
   - Cache LLM provider key/config in `sessionStorage`, not local storage, cookies, backend storage, fixtures, or exports.
   - Show that the key is only kept for the browser session and provide a clear action to remove it.

## Test Strategy

- **Unit:** verify DeepSeek preset uses a V4 model and JSON export still excludes keys.
- **E2E:** verify homepage/report emphasize user outcomes, show DeepSeek key guidance, cache/restore session key, and keep raw JSON behind an advanced disclosure.
- **STT:** run OpenSpec, lint, unit tests, build, and E2E before commit.

## Risks / Trade-offs

- Hiding source data too far may frustrate developers; keep advanced disclosure discoverable.
- Session key cache improves UX but must remain clearly bounded to the current browser session.
- Adding a new chart dependency would increase maintenance; prefer Recharts already present in the project.
