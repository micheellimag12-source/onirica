import { OniricaMark } from "@/components/OniricaMark";

export interface NavItem {
  id: string;
  label: string;
}

interface Props {
  nome: string;
  nav: NavItem[];
  children: React.ReactNode;
}

/** Casca da área de entrega: topo fixo com navegação + conteúdo em scroll. */
export function AreaShell({ nome, nav, children }: Props) {
  const primeiroNome = nome.trim().split(/\s+/)[0] ?? nome;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
          <a href="#topo" className="flex items-center gap-2">
            <OniricaMark size={24} />
            <span className="font-display text-lg tracking-wide text-primary">
              Onírica
            </span>
          </a>
          <nav className="hidden items-center gap-5 md:flex">
            {nav.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="text-sm text-foreground/70 transition-colors hover:text-primary"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <span className="hidden text-sm text-muted-foreground sm:block">
            {primeiroNome}
          </span>
        </div>
      </header>

      <main id="topo" className="mx-auto max-w-3xl px-5 pb-32">
        {children}
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

/** Cabeçalho de seção reutilizável. */
export function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-8 text-center">
      <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary/80">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl leading-tight text-foreground md:text-4xl">
        {title}
      </h2>
    </div>
  );
}
