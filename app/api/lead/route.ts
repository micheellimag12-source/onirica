import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const LeadSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  identificacao_espiritual: z.string().optional(),
});

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

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Lead inválido" },
      { status: 400 },
    );
  }

  // TODO (próxima fase): persistir lead parcial no Supabase para sequência de remarketing.
  console.log("[Onírica] Lead capture parcial:", parsed.data);

  return NextResponse.json({ success: true });
}
