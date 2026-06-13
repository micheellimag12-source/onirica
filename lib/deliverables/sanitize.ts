/**
 * Remove travessões (— em dash, – en dash) de textos gerados por IA, para o
 * conteúdo não "soar IA". Substitui por vírgula e limpa pontuação duplicada.
 * Guarda-costas: os prompts já pedem para não usar travessão; isto garante.
 */
export function stripDashes(s: string): string {
  return s
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/\s+,/g, ",")
    .replace(/,\s*,/g, ",")
    .replace(/,\s*([.;:!?])/g, "$1")
    .replace(/[ \t]{2,}/g, " ");
}

/** Aplica `stripDashes` recursivamente em todas as strings de um objeto. */
export function stripDashesDeep<T>(value: T): T {
  if (typeof value === "string") return stripDashes(value) as unknown as T;
  if (Array.isArray(value)) return value.map(stripDashesDeep) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = stripDashesDeep(v);
    return out as T;
  }
  return value;
}
