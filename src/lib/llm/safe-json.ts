export function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const direct = tryParse(trimmed);
  if (direct.ok) return direct.value;

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    const parsed = tryParse(fenced[1].trim());
    if (parsed.ok) return parsed.value;
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    const parsed = tryParse(trimmed.slice(start, end + 1));
    if (parsed.ok) return parsed.value;
  }

  throw new Error("LLM response did not contain valid JSON.");
}

function tryParse(value: string): { ok: true; value: unknown } | { ok: false } {
  try {
    return { ok: true, value: JSON.parse(value) as unknown };
  } catch {
    return { ok: false };
  }
}
