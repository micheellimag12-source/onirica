"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Composição abstrata que evoca o Mapa Onírico: aura central, anéis
 * concêntricos e uma constelação. É decorativa, não representa a peça
 * real entregue ao cliente.
 */

const STARS = [
  { cx: 200, cy: 62, r: 2.6, d: 0 },
  { cx: 312, cy: 128, r: 1.8, d: 0.6 },
  { cx: 336, cy: 236, r: 2.2, d: 1.2 },
  { cx: 238, cy: 330, r: 1.6, d: 0.3 },
  { cx: 120, cy: 316, r: 2.4, d: 0.9 },
  { cx: 64, cy: 204, r: 1.9, d: 1.5 },
  { cx: 96, cy: 104, r: 2.1, d: 0.45 },
];

const CONSTELLATION = [
  { cx: 150, cy: 150 },
  { cx: 196, cy: 118 },
  { cx: 246, cy: 156 },
  { cx: 262, cy: 214 },
  { cx: 214, cy: 256 },
  { cx: 158, cy: 224 },
];

export function DreamVisual({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const gold = `dv-gold-${uid}`;
  const glow = `dv-glow-${uid}`;
  const fade = `dv-fade-${uid}`;
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="Ilustração de uma constelação sobre uma aura dourada"
    >
      <defs>
        <linearGradient id={gold} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#F3DA8A" />
          <stop offset="0.45" stopColor="#D9AE4C" />
          <stop offset="1" stopColor="#A97C24" />
        </linearGradient>

        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#D4A744" stopOpacity="0.34" />
          <stop offset="0.55" stopColor="#D4A744" stopOpacity="0.08" />
          <stop offset="1" stopColor="#D4A744" stopOpacity="0" />
        </radialGradient>

        {/* Anéis somem na borda inferior para fundir com o fundo */}
        <radialGradient id={fade} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${fade}-mask`}>
          <rect width="400" height="400" fill={`url(#${fade})`} />
        </mask>
      </defs>

      {/* Aura */}
      <motion.circle
        cx="200"
        cy="200"
        r="190"
        fill={`url(#${glow})`}
        animate={reduce ? undefined : { scale: [1, 1.05, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "200px 200px" }}
      />

      <g mask={`url(#${fade}-mask)`}>
        {/* Anéis concêntricos */}
        <circle cx="200" cy="200" r="96" fill="none" stroke={`url(#${gold})`} strokeWidth="0.8" opacity="0.35" />
        <circle cx="200" cy="200" r="138" fill="none" stroke={`url(#${gold})`} strokeWidth="0.6" opacity="0.22" />

        <motion.circle
          cx="200"
          cy="200"
          r="176"
          fill="none"
          stroke={`url(#${gold})`}
          strokeWidth="0.6"
          strokeDasharray="2 10"
          opacity="0.3"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 200px" }}
        />

        {/* Constelação */}
        <motion.g
          animate={reduce ? undefined : { rotate: -360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 200px" }}
        >
          <polyline
            points={CONSTELLATION.map((p) => `${p.cx},${p.cy}`).join(" ")}
            fill="none"
            stroke={`url(#${gold})`}
            strokeWidth="0.8"
            opacity="0.4"
            strokeLinejoin="round"
          />
          {CONSTELLATION.map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r="2.4" fill={`url(#${gold})`} opacity="0.85" />
          ))}
        </motion.g>
      </g>

      {/* Estrelas soltas */}
      {STARS.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill={`url(#${gold})`}
          animate={reduce ? undefined : { opacity: [0.25, 0.9, 0.25] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: s.d }}
          style={{ opacity: 0.6 }}
        />
      ))}

      {/* Núcleo */}
      <circle cx="200" cy="200" r="30" fill="#0B1733" opacity="0.55" />
      <circle cx="200" cy="200" r="30" fill="none" stroke={`url(#${gold})`} strokeWidth="1.2" opacity="0.7" />
      <path
        d="M200 178 a22 22 0 1 0 14 39 a26 26 0 1 1 -14 -39 Z"
        fill={`url(#${gold})`}
        opacity="0.9"
      />
    </svg>
  );
}
