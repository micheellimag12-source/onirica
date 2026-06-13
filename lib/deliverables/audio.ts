import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Síntese do áudio narrado (order bump) via OpenAI TTS (tts-1) e armazenamento
 * no Supabase Storage. O roteiro costuma passar do limite de 4096 chars do
 * tts-1, então quebramos em pedaços e concatenamos os MP3.
 */

const TTS_MODEL = "tts-1";
const VOICE = process.env.OPENAI_TTS_VOICE || "nova";
const MAX_CHARS = 3800; // folga sob o limite de 4096 do tts-1
const BUCKET = "deliverables";

export function audioConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

/** Quebra o texto em pedaços <= MAX_CHARS, respeitando parágrafos e frases. */
export function chunkText(text: string, max = MAX_CHARS): string[] {
  const paras = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const pieces: string[] = [];
  for (const p of paras) {
    if (p.length <= max) {
      pieces.push(p);
      continue;
    }
    const sentences = p.match(/[^.!?…]+[.!?…]+|\S[\s\S]*$/g) ?? [p];
    let cur = "";
    for (const s of sentences) {
      if ((cur + s).length > max) {
        if (cur) pieces.push(cur.trim());
        cur = s;
      } else {
        cur += s;
      }
    }
    if (cur) pieces.push(cur.trim());
  }
  // junta pedaços adjacentes para minimizar chamadas
  const chunks: string[] = [];
  let cur = "";
  for (const piece of pieces) {
    const joined = cur ? `${cur}\n\n${piece}` : piece;
    if (joined.length > max) {
      if (cur) chunks.push(cur);
      cur = piece;
    } else {
      cur = joined;
    }
  }
  if (cur) chunks.push(cur);
  return chunks.filter(Boolean);
}

async function ttsChunk(input: string): Promise<Buffer> {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: TTS_MODEL, voice: VOICE, input, response_format: "mp3" }),
  });
  if (!res.ok) {
    throw new Error(`OpenAI TTS falhou (${res.status}): ${await res.text()}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

/** Gera o MP3 completo da narração (concatenando os pedaços). */
export async function synthesizeNarration(text: string): Promise<Buffer> {
  if (!audioConfigured()) throw new Error("OPENAI_API_KEY não configurada.");
  const chunks = chunkText(text);
  const buffers: Buffer[] = [];
  for (const c of chunks) buffers.push(await ttsChunk(c));
  return Buffer.concat(buffers);
}

/** Sobe o MP3 no Storage e devolve a URL pública (caminho não adivinhável). */
export async function storeAudio(path: string, mp3: Buffer): Promise<string> {
  const db = supabaseAdmin();
  const { error } = await db.storage
    .from(BUCKET)
    .upload(path, mp3, { contentType: "audio/mpeg", upsert: true });
  if (error) throw error;
  return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Pipeline: roteiro -> MP3 -> Storage -> URL. `token` vira o caminho secreto. */
export async function generateAndStoreAudio(opts: {
  token: string;
  text: string;
}): Promise<string> {
  const mp3 = await synthesizeNarration(opts.text);
  return storeAudio(`audio/${opts.token}.mp3`, mp3);
}
