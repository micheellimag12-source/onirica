import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { QuizSubmissionSchema } from "@/lib/validation";

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

  // TODO (próxima fase): persistir no Supabase + disparar webhook n8n para o pipeline de IA.
  const analysis_id = crypto.randomUUID();

  return NextResponse.json({ success: true, analysis_id });
}
