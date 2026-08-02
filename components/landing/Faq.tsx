import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * CONFERIR ANTES DE PUBLICAR: as respostas marcadas com [checar] descrevem
 * regras comerciais que eu inferi do código, não de uma fonte oficial.
 * Ajuste o texto se a oferta funcionar de outro jeito.
 */
const PERGUNTAS: { q: string; a: React.ReactNode }[] = [
  {
    q: "E se a análise não falar comigo?",
    a: (
      <p>
        Você tem 7 dias. Se a leitura não fizer sentido para você, é só pedir que
        eu devolvo o valor integral, sem precisar justificar.
      </p>
    ),
  },
  {
    // [checar] fronteira exata entre gratuito e pago
    q: "Preciso pagar para começar?",
    a: (
      <p>
        Não. Você responde as perguntas e recebe uma prévia da sua análise sem
        pagar nada. A análise completa, com o Mapa Onírico e o diário, é a parte
        paga, e você só decide depois de ver a prévia.
      </p>
    ),
  },
  {
    q: "Quanto tempo leva?",
    a: (
      <p>
        Cerca de 6 minutos. São perguntas curtas sobre o seu sonho, o que você
        sentiu e o momento de vida que está vivendo. Dá para responder do
        celular, com calma.
      </p>
    ),
  },
  {
    // [checar] áudio e meditação aparecem como upsell no código (R$14,97 e R$11,97)
    q: "O que exatamente eu recebo?",
    a: (
      <>
        <p>
          A análise completa do seu sonho, o seu Mapa Onírico (uma peça visual
          feita a partir dos símbolos que apareceram) e um diário de 7 dias para
          acompanhar o que vier nas próximas noites.
        </p>
        <p>
          A narração em áudio na voz da Onírica e a meditação guiada ficam
          disponíveis à parte, dentro da sua área.
        </p>
      </>
    ),
  },
  {
    q: "Isso é religioso ou é científico?",
    a: (
      <p>
        Os dois, e sem escolher um lado. A Onírica lê o seu sonho à luz da
        neurociência do sono, da psicologia profunda e da tradição bíblica.
        Você recebe as três leituras, não uma versão diluída delas.
      </p>
    ),
  },
  {
    q: "Isso não é só um horóscopo com outro nome?",
    a: (
      <p>
        Não. Horóscopo entrega o mesmo texto para todo mundo que nasceu no mesmo
        mês. Aqui, nada é pré-escrito: a interpretação nasce do sonho que você
        contou, das palavras que você usou e da pergunta que você trouxe.
      </p>
    ),
  },
  {
    // [checar] confirmar se o fluxo aceita bem relatos fragmentados
    q: "E se eu não lembrar do sonho inteiro?",
    a: (
      <p>
        Tudo bem. Fragmentos já bastam. Uma imagem solta, uma sensação ao
        acordar ou uma única cena costumam carregar o essencial, e as perguntas
        foram feitas para trabalhar justamente com isso.
      </p>
    ),
  },
  {
    q: "O que acontece com o que eu escrever?",
    a: (
      <p>
        Seu sonho é usado para gerar a sua análise e fica guardado na sua área
        de acesso. Os detalhes de tratamento de dados estão na{" "}
        <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
      </p>
    ),
  },
];

export function Faq() {
  return (
    <section className="mt-24 w-full max-w-[620px] md:mt-28">
      <p className="mb-8 text-center text-xs uppercase tracking-[0.25em] text-primary/80">
        Antes de começar
      </p>

      <Accordion multiple={false} className="gap-0">
        {PERGUNTAS.map((item, i) => (
          <AccordionItem
            key={item.q}
            value={`q-${i}`}
            className="border-b border-border/60"
          >
            <AccordionTrigger className="py-4 text-left font-display text-base font-normal leading-snug text-foreground hover:no-underline md:text-lg">
              {item.q}
            </AccordionTrigger>
            {/* O padding e a tipografia vão num wrapper interno de propósito:
                o elemento do AccordionContent tem a altura fixada por
                --accordion-panel-height, e alterar o box dele corta o texto. */}
            <AccordionContent>
              <div className="pb-5 pr-6 leading-relaxed text-foreground/70">
                {item.a}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
