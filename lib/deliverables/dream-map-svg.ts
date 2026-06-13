/**
 * Mapa Onírico visual — pôster SVG (retrato, imprimível) gerado a partir dos
 * símbolos da análise. Mesma identidade do produto: azul-noite + dourado.
 *
 * Sem dependências: retorna uma string SVG que pode ser servida, embutida numa
 * página ou rasterizada (sharp) para PNG/PDF.
 */

export interface DreamMapData {
  nome: string;
  titulo: string;
  palavraGuia: string;
  simbolos: { nome: string; significadoCurto: string }[];
}

const W = 820;
const NAVY = "#0B1733";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Quebra um texto em linhas com no máximo `maxChars` caracteres por linha. */
function wrap(text: string, maxChars: number): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if (!line) {
      line = w;
    } else if ((line + " " + w).length <= maxChars) {
      line += " " + w;
    } else {
      lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function tspans(
  lines: string[],
  x: number,
  lineHeight: number,
  firstDy = 0,
): string {
  return lines
    .map(
      (ln, i) =>
        `<tspan x="${x}" dy="${i === 0 ? firstDy : lineHeight}">${escapeXml(
          ln,
        )}</tspan>`,
    )
    .join("");
}

/** Estrelinha de 4 pontas em (cx,cy) com raio r. */
function star(cx: number, cy: number, r: number, fill = "url(#mapGold)"): string {
  const s = r * 0.32;
  return `<path fill="${fill}" d="M${cx} ${cy - r} L${cx + s} ${cy - s} L${
    cx + r
  } ${cy} L${cx + s} ${cy + s} L${cx} ${cy + r} L${cx - s} ${cy + s} L${
    cx - r
  } ${cy} L${cx - s} ${cy - s} Z"/>`;
}

export function renderDreamMapSVG(data: DreamMapData): string {
  const { nome, titulo, palavraGuia } = data;
  // Constelação mostra até 5 símbolos; a legenda lista todos.
  const nodes = data.simbolos.slice(0, 5);

  const cx = W / 2;
  const cy = 452;
  const R = 232;
  const medallionR = 74;

  // ── Constelação ──────────────────────────────────────────────
  const lines: string[] = [];
  const dots: string[] = [];
  const labels: string[] = [];

  nodes.forEach((s, i) => {
    const angle = (-90 + (i * 360) / nodes.length) * (Math.PI / 180);
    const x = cx + R * Math.cos(angle);
    const y = cy + R * Math.sin(angle);
    const cosA = Math.cos(angle);

    // linha do medalhão até o nó
    const startX = cx + (medallionR + 6) * Math.cos(angle);
    const startY = cy + (medallionR + 6) * Math.sin(angle);
    const endX = cx + (R - 12) * Math.cos(angle);
    const endY = cy + (R - 12) * Math.sin(angle);
    lines.push(
      `<line x1="${startX.toFixed(1)}" y1="${startY.toFixed(1)}" x2="${endX.toFixed(
        1,
      )}" y2="${endY.toFixed(1)}" stroke="url(#mapGold)" stroke-width="1" opacity="0.45"/>`,
    );

    dots.push(star(x, y, 9));

    const anchor = cosA > 0.25 ? "start" : cosA < -0.25 ? "end" : "middle";
    const nameLines = wrap(s.nome, 16);
    const NL = 19; // altura de linha
    let lx: number;
    let labelY: number;
    let firstDy: number;
    if (anchor === "middle") {
      // nós de topo/base: empurra o rótulo para longe da estrela (cima ou baixo)
      lx = x;
      if (Math.sin(angle) < 0) {
        labelY = y - 22 - (nameLines.length - 1) * NL; // topo → acima
      } else {
        labelY = y + 34; // base → abaixo
      }
      firstDy = 0;
    } else {
      // nós laterais: rótulo ao lado, centralizado na vertical do nó
      lx = x + (anchor === "start" ? 18 : -18);
      labelY = y;
      firstDy = -((nameLines.length - 1) * NL) / 2 + 5;
    }
    labels.push(
      `<text x="${lx.toFixed(1)}" y="${labelY.toFixed(
        1,
      )}" text-anchor="${anchor}" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="#F5F1E8">${tspans(
        nameLines,
        lx,
        NL,
        firstDy,
      )}</text>`,
    );
  });

  // palavra-guia dentro do medalhão (até 2 linhas)
  const guiaLines = wrap(palavraGuia, 11);
  const guiaFirstDy = -((guiaLines.length - 1) * 26) / 2 + 9;
  const medallion = `
    <circle cx="${cx}" cy="${cy}" r="${medallionR}" fill="${NAVY}" stroke="url(#mapGold)" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${medallionR - 8}" fill="none" stroke="url(#mapGold)" stroke-width="0.75" opacity="0.5"/>
    <text x="${cx}" y="${cy}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="26" fill="url(#mapGold)">${tspans(
      guiaLines,
      cx,
      26,
      guiaFirstDy,
    )}</text>`;

  // ── Título ───────────────────────────────────────────────────
  const titleLines = wrap(titulo, 26);
  const titleSvg = `<text x="${cx}" y="150" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="46" fill="url(#mapGold)">${tspans(
    titleLines,
    cx,
    52,
  )}</text>`;

  // ── Legenda ──────────────────────────────────────────────────
  let ly = 768;
  const legend: string[] = [
    `<text x="${cx}" y="${ly}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="13" letter-spacing="3" fill="url(#mapGold)">OS SÍMBOLOS DO SEU SONHO</text>`,
  ];
  ly += 34;
  const legendX = 96;
  const textX = legendX + 26;
  data.simbolos.forEach((s) => {
    const meaningLines = wrap(s.significadoCurto, 64);
    legend.push(star(legendX, ly - 5, 7));
    legend.push(
      `<text x="${textX}" y="${ly}" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="#F5F1E8">${escapeXml(
        s.nome,
      )}</text>`,
    );
    legend.push(
      `<text x="${textX}" y="${
        ly + 24
      }" font-family="Helvetica, Arial, sans-serif" font-size="15" fill="#F5F1E8" opacity="0.72">${tspans(
        meaningLines,
        textX,
        20,
      )}</text>`,
    );
    ly += 30 + meaningLines.length * 20 + 18;
  });

  // altura do pôster se adapta ao tamanho da legenda
  const H = Math.max(1120, ly + 72);

  // ── Estrelas decorativas de fundo (fixas) ────────────────────
  const bgStars = [
    [120, 230, 2.5],
    [690, 300, 3],
    [150, 560, 2],
    [700, 620, 2.5],
    [90, 410, 2],
    [730, 470, 2],
    [410, 250, 2],
    [250, 690, 2],
    [560, 700, 2.5],
  ]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#F5F1E8" opacity="0.35"/>`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <radialGradient id="mapBg" cx="50%" cy="34%" r="75%">
      <stop offset="0" stop-color="#152244"/>
      <stop offset="1" stop-color="${NAVY}"/>
    </radialGradient>
    <linearGradient id="mapGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F3DA8A"/>
      <stop offset="0.5" stop-color="#D9AE4C"/>
      <stop offset="1" stop-color="#A97C24"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#mapBg)"/>
  <rect x="20" y="20" width="${W - 40}" height="${H - 40}" rx="10" fill="none" stroke="url(#mapGold)" stroke-width="1" opacity="0.4"/>
  ${bgStars}

  <text x="${cx}" y="72" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="14" letter-spacing="6" fill="url(#mapGold)">MAPA ONÍRICO</text>
  ${titleSvg}

  ${lines.join("\n  ")}
  ${dots.join("\n  ")}
  ${medallion}
  ${labels.join("\n  ")}

  <line x1="96" y1="730" x2="${W - 96}" y2="730" stroke="url(#mapGold)" stroke-width="0.75" opacity="0.4"/>
  ${legend.join("\n  ")}

  <line x1="96" y1="${H - 86}" x2="${W - 96}" y2="${H - 86}" stroke="url(#mapGold)" stroke-width="0.75" opacity="0.4"/>
  <text x="96" y="${H - 56}" font-family="Georgia, 'Times New Roman', serif" font-size="16" fill="#F5F1E8" opacity="0.8">Para ${escapeXml(
    nome,
  )}</text>
  <text x="${W - 96}" y="${H - 56}" text-anchor="end" font-family="Georgia, 'Times New Roman', serif" font-size="18" fill="url(#mapGold)" letter-spacing="1">Onírica</text>
</svg>`;
}
