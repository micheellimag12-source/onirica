import { Moon, RefreshCw, Compass, HeartCrack } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Os sonhos que trazem as pessoas até aqui.
 *
 * Isto NÃO é depoimento: são as situações reais que o produto resolve, escritas
 * como situação e não como frase de cliente. Serve ao mesmo trabalho de
 * identificação ("é exatamente o meu caso") sem atribuir a ninguém algo que
 * ninguém disse. Depoimento com nome e frase só entra em `lib/depoimentos.ts`,
 * e só quando for real.
 *
 * Cada cenário aponta para um entregável que existe de verdade: a resposta à
 * pergunta dela, o diário de 7 dias, o material de sono.
 */

interface Cenario {
  icon: LucideIcon;
  titulo: string;
  situacao: string;
  resolucao: string;
}

const CENARIOS: Cenario[] = [
  {
    icon: HeartCrack,
    titulo: "O sonho com quem já partiu",
    situacao:
      "Alguém que você perdeu aparece noite após noite, e você acorda sem saber se aquilo foi saudade, mensagem ou só a sua cabeça remoendo.",
    resolucao:
      "A análise separa essas três coisas e responde por que essa presença voltou agora, nesta fase da sua vida.",
  },
  {
    icon: RefreshCw,
    titulo: "O sonho que não vai embora",
    situacao:
      "A mesma cena volta há semanas. Você já tentou ignorar, e ela continua ali quando você deita.",
    resolucao:
      "Sonho que repete costuma insistir porque ficou algo sem resposta. O diário de 7 dias acompanha o que vier nas próximas noites.",
  },
  {
    icon: Compass,
    titulo: "O pesadelo que chegou junto com a decisão",
    situacao:
      "Você está no meio de uma escolha difícil e, do nada, as noites ficaram pesadas.",
    resolucao:
      "Não é coincidência. Entender o que o medo está desenhando enquanto você dorme muda o jeito de decidir acordada.",
  },
  {
    icon: Moon,
    titulo: "O sonho que parece aviso",
    situacao:
      "Você acordou com a sensação de que precisa fazer alguma coisa, sem conseguir dizer o quê.",
    resolucao:
      "Sua análise responde diretamente a única pergunta que você faria ao seu sonho, sem rodeio e sem susto.",
  },
];

export function Cenarios() {
  return (
    <section className="mt-24 w-full max-w-[960px] md:mt-32">
      <p className="mb-3 text-center text-xs uppercase tracking-[0.25em] text-primary/80">
        Talvez seja o seu caso
      </p>
      <h2 className="mx-auto mb-10 max-w-[520px] text-balance text-center font-display text-2xl leading-tight text-foreground md:text-3xl">
        Os sonhos que trazem as pessoas até aqui
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {CENARIOS.map((c) => (
          <article
            key={c.titulo}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6"
          >
            <span className="flex size-10 items-center justify-center rounded-full border border-primary/25 bg-primary/10">
              <c.icon className="size-4.5 text-primary" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="font-display text-xl leading-tight text-foreground">
              {c.titulo}
            </h3>
            <p className="leading-relaxed text-foreground/75">{c.situacao}</p>
            <p className="leading-relaxed text-foreground/90">{c.resolucao}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
