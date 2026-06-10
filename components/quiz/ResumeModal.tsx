"use client";

import { motion } from "motion/react";
import { CTAButton } from "@/components/CTAButton";

interface Props {
  onResume: () => void;
  onStartFresh: () => void;
}

export function ResumeModal({ onResume, onStartFresh }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-background/85 backdrop-blur-sm flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-[440px] bg-card border border-border rounded-lg p-7 flex flex-col gap-5"
      >
        <h3 className="font-display text-2xl text-foreground leading-tight">
          Você estava no meio do quiz
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Detectamos que você estava no meio do quiz. Quer continuar de onde
          parou?
        </p>
        <div className="flex flex-col gap-2 mt-2">
          <CTAButton type="button" onClick={onResume}>
            Continuar
          </CTAButton>
          <button
            type="button"
            onClick={onStartFresh}
            className="text-sm text-muted-foreground hover:text-foreground transition py-2 self-center"
          >
            Começar de novo
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
