// Pure parser for the accent-pill text in ChatGPT's composer.
//
// Observed patterns:
//   null or ""     → { model: "Instant", thinking: null, pill: null }
//   "Thinking"     → { model: "Thinking", thinking: null, pill: "Thinking" }
//   "Pro"          → { model: "Pro",      thinking: null, pill: "Pro" }
//   "Länger Pro"   → { model: "Pro",      thinking: "Länger", pill: "Länger Pro" }
//
// Heuristic: last whitespace-separated token = model, anything before = thinking level.
// When there is no pill at all, the current model is "Instant" (no thinking concept).

export function parsePillText(raw) {
  if (raw == null || raw === '') return { model: 'Instant', thinking: null, pill: null };
  const text = String(raw).trim();
  if (!text) return { model: 'Instant', thinking: null, pill: null };
  const tokens = text.split(/\s+/).filter(Boolean);
  if (tokens.length >= 2) {
    return {
      model: tokens[tokens.length - 1],
      thinking: tokens.slice(0, -1).join(' '),
      pill: text,
    };
  }
  return { model: text, thinking: null, pill: text };
}
