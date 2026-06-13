"use client";

import { useState } from "react";
import type { Narration } from "@/lib/deliverables";
import { SectionHeader } from "./AreaShell";
import { Paragraphs } from "./Paragraphs";

/** Seção do áudio narrado (order bump). Player quando há MP3; roteiro sempre. */
export function AudioSection({
  narration,
  audioUrl,
}: {
  narration: Narration;
  audioUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section id="audio" className="scroll-mt-20 pt-20">
      <SectionHeader eyebrow="Order bump" title="Sua análise narrada" />

      <div className="rounded-2xl border border-border bg-card p-7">
        <p className="mb-5 leading-relaxed text-foreground/80">
          Ouça sua análise na voz da Onírica, de olhos fechados, talvez antes de
          dormir.
        </p>

        {audioUrl ? (
          <audio controls preload="none" className="w-full" src={audioUrl}>
            Seu navegador não suporta áudio.
          </audio>
        ) : (
          <div className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
            Áudio sendo preparado, disponível em instantes.
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-5 text-sm text-primary transition-colors hover:text-primary/80"
        >
          {open ? "Ocultar transcrição" : "Ler a transcrição"}
        </button>

        {open ? (
          <Paragraphs
            text={narration.roteiro}
            className="mt-5 border-t border-border pt-5 text-foreground/80"
          />
        ) : null}
      </div>
    </section>
  );
}
