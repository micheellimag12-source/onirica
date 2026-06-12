"use client";

import { useId } from "react";

interface OniricaMarkProps {
  className?: string;
  size?: number;
}

/**
 * Símbolo da Onírica — lua crescente + pena + estrelas num medalhão dourado.
 * O gradiente é embutido (dourado metálico), independente da cor do texto.
 */
export function OniricaMark({ className, size = 20 }: OniricaMarkProps) {
  const uid = useId().replace(/:/g, "");
  const gold = `gold-${uid}`;
  const crescent = `crescent-${uid}`;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id={gold} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#F3DA8A" />
          <stop offset="0.45" stopColor="#D9AE4C" />
          <stop offset="1" stopColor="#A97C24" />
        </linearGradient>
        <mask id={crescent}>
          <rect width="100" height="100" fill="black" />
          <circle cx="50" cy="50" r="38" fill="white" />
          <circle cx="64" cy="42" r="34" fill="black" />
        </mask>
      </defs>

      {/* anel externo */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={`url(#${gold})`}
        strokeWidth="2.5"
      />

      {/* lua crescente */}
      <rect
        width="100"
        height="100"
        fill={`url(#${gold})`}
        mask={`url(#${crescent})`}
      />

      {/* pena, aninhada na curva da lua */}
      <g fill={`url(#${gold})`}>
        <path d="M44 20 C 34 36, 33 56, 38 76 C 30 60, 30 38, 44 20 Z" />
        <path d="M44 20 C 40 44, 39 60, 38 76 L 41 76 C 50 56, 52 36, 44 20 Z" />
      </g>
      <g stroke="#0B1733" strokeWidth="1.2" strokeLinecap="round">
        <line x1="42" y1="32" x2="37" y2="36" />
        <line x1="41" y1="42" x2="35" y2="46" />
        <line x1="40" y1="52" x2="34" y2="56" />
        <line x1="40" y1="62" x2="35" y2="66" />
      </g>

      {/* estrelas */}
      <g fill={`url(#${gold})`}>
        <path d="M70 40 l1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6 Z" />
        <path d="M64 60 l1 2.8 2.8 1 -2.8 1 -1 2.8 -1 -2.8 -2.8 -1 2.8 -1 Z" />
        <path d="M73 56 l0.7 2 2 0.7 -2 0.7 -0.7 2 -0.7 -2 -2 -0.7 2 -0.7 Z" />
      </g>
    </svg>
  );
}
