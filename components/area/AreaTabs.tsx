"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { OniricaMark } from "@/components/OniricaMark";
import { cn } from "@/lib/utils";

export interface AreaTab {
  id: string;
  label: string;
  locked?: boolean;
  node: React.ReactNode;
}

/** Área de entrega em abas: filtra/seleciona o entregável a ver. */
export function AreaTabs({ nome, tabs }: { nome: string; tabs: AreaTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const primeiroNome = nome.trim().split(/\s+/)[0] || nome;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <OniricaMark size={22} />
            <span className="font-display text-lg tracking-wide text-primary">
              Onírica
            </span>
          </div>
          <span className="text-sm text-muted-foreground">{primeiroNome}</span>
        </div>

        <div className="mx-auto max-w-3xl overflow-x-auto px-5 pb-3 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(t.id)}
                aria-pressed={active === t.id}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors",
                  active === t.id
                    ? "border-primary bg-primary/15 text-primary"
                    : t.locked
                      ? "border-border text-muted-foreground hover:border-primary/40"
                      : "border-border text-foreground/70 hover:border-primary/50",
                )}
              >
                {t.locked ? <Lock className="size-3.5" aria-hidden="true" /> : null}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-28">
        {tabs.map((t) => (
          <div key={t.id} hidden={active !== t.id}>
            {t.node}
          </div>
        ))}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-8 text-sm text-muted-foreground">
          <span className="font-display text-base text-primary">Onírica</span>
          <span>Feito para {primeiroNome}</span>
        </div>
      </footer>
    </div>
  );
}
