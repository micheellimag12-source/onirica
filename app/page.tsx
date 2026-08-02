import { cookies } from "next/headers";
import { QuizFlow } from "@/components/quiz/QuizFlow";
import { SiteFooter } from "@/components/SiteFooter";
import { AB_COOKIE, isVariant } from "@/lib/ab";

export default async function Home() {
  const cookieStore = await cookies();
  const bruto = cookieStore.get(AB_COOKIE)?.value;
  // O proxy sorteia e grava o cookie; "a" aqui é só rede de segurança (bot,
  // preview, primeira requisição sem cookie).
  const variant = isVariant(bruto) ? bruto : "a";

  return (
    <>
      <QuizFlow variant={variant} />
      <SiteFooter />
    </>
  );
}
