import { randomBytes } from "node:crypto";
import type { QuizAnswers } from "@/types/quiz";
import type {
  FullAnalysis,
  Journal,
  Narration,
  Meditation,
} from "./deliverables";
import { supabaseAdmin } from "./supabase/server";

/**
 * Camada de dados da tabela `analyses` no Supabase.
 * Regra: 1 compra = 1 linha = 1 token de acesso = 1 análise.
 */

export type AnalysisStatus = "pending" | "generating" | "ready" | "error";

export interface AnalysisRow {
  id: string;
  token: string;
  status: AnalysisStatus;
  email: string | null;
  nome: string | null;
  cakto_order_id: string | null;
  bump_audio: boolean;
  bump_meditation: boolean;
  answers: QuizAnswers;
  analysis: FullAnalysis | null;
  journal: Journal | null;
  narration: Narration | null;
  meditation: Meditation | null;
  audio_url: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
  generated_at: string | null;
}

/** Token secreto de acesso (vai na URL de entrega: /minha-analise/<token>). */
export function newAccessToken(): string {
  return randomBytes(24).toString("base64url");
}

/** Cria a linha no submit do quiz (status pending). Retorna id + token. */
export async function createAnalysis(
  answers: QuizAnswers,
): Promise<{ id: string; token: string }> {
  const db = supabaseAdmin();
  const token = newAccessToken();
  const { data, error } = await db
    .from("analyses")
    .insert({
      token,
      answers,
      nome: answers.nome ?? null,
      email: answers.email ?? null,
      status: "pending",
    })
    .select("id, token")
    .single();
  if (error) throw error;
  return data as { id: string; token: string };
}

export async function getAnalysisByToken(
  token: string,
): Promise<AnalysisRow | null> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("analyses")
    .select("*")
    .eq("token", token)
    .maybeSingle();
  if (error) throw error;
  return (data as AnalysisRow | null) ?? null;
}

export async function getAnalysisByCaktoOrder(
  orderId: string,
): Promise<AnalysisRow | null> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("analyses")
    .select("*")
    .eq("cakto_order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as AnalysisRow | null) ?? null;
}

export async function getAnalysisById(id: string): Promise<AnalysisRow | null> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("analyses")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as AnalysisRow | null) ?? null;
}

export async function updateAnalysis(
  id: string,
  patch: Partial<
    Pick<
      AnalysisRow,
      | "status"
      | "analysis"
      | "journal"
      | "narration"
      | "meditation"
      | "audio_url"
      | "error"
      | "generated_at"
      | "cakto_order_id"
      | "bump_audio"
      | "bump_meditation"
      | "email"
      | "nome"
    >
  >,
): Promise<void> {
  const db = supabaseAdmin();
  const { error } = await db.from("analyses").update(patch).eq("id", id);
  if (error) throw error;
}
