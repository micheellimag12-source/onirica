import { NextRequest, NextResponse } from "next/server";
import { QuizSubmissionSchema } from "@/lib/validation";
import { createAnalysis } from "@/lib/analyses";
import { supabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Payload inválido" },
      { status: 400 },
    );
  }

  const parsed = QuizSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Dados inválidos",
        issues: parsed.error.issues,
      },
      { status: 400 },
    );
  }

  // Persiste a submissão (status pending). Se o Supabase ainda não estiver
  // configurado, cai num id efêmero para não quebrar o funil.
  if (supabaseConfigured()) {
    try {
      const { id } = await createAnalysis(parsed.data);
      return NextResponse.json({ success: true, analysis_id: id });
    } catch (error) {
      console.error("[quiz] falha ao persistir análise:", error);
      // Não bloqueia a conversão: segue com id efêmero.
    }
  }

  return NextResponse.json({ success: true, analysis_id: crypto.randomUUID() });
}
