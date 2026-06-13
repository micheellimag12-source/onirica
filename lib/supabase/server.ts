import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase de servidor, usando a chave SECRETA (service role).
 * Bypassa RLS — só pode ser importado em código server-side (rotas/handlers,
 * server components). Nunca expor a chave secreta no cliente.
 */
let cached: SupabaseClient | null = null;

export function supabaseConfigured(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
}

export function supabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase não configurado: defina SUPABASE_URL e SUPABASE_SECRET_KEY.",
    );
  }
  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
