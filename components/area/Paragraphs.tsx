/** Renderiza um texto com quebras de parágrafo (\n\n) como <p> espaçados. */
export function Paragraphs({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const paras = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className={`space-y-4 ${className}`}>
      {paras.map((p, i) => (
        <p key={i} className="leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  );
}
