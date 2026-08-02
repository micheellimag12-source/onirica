import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AB_COOKIE, AB_MAX_AGE, isVariant } from "@/lib/ab";

/**
 * Sorteia a variante da headline uma única vez por pessoa e fixa em cookie.
 *
 * Nesta versão do Next o antigo `middleware` se chama `proxy` (mesma função).
 * O sorteio acontece aqui, antes da renderização, para a página já sair do
 * servidor com a headline certa.
 */
export function proxy(request: NextRequest) {
  const atual = request.cookies.get(AB_COOKIE)?.value;
  if (isVariant(atual)) return NextResponse.next();

  const variante = Math.random() < 0.5 ? "a" : "b";
  const response = NextResponse.next();
  response.cookies.set(AB_COOKIE, variante, {
    path: "/",
    maxAge: AB_MAX_AGE,
    sameSite: "lax",
    // Legível pelo cliente de propósito: o Pixel manda a variante junto dos eventos.
    httpOnly: false,
  });
  return response;
}

export const config = {
  // Só a home. Área de entrega, APIs e assets ficam de fora.
  matcher: "/",
};
