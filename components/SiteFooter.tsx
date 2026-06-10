import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 py-8 px-6 mt-20">
      <div className="max-w-[600px] mx-auto flex flex-col items-center gap-2 text-xs text-muted-foreground">
        <Link
          href="/politica-de-privacidade"
          className="hover:text-foreground transition-colors"
        >
          Política de Privacidade
        </Link>
        <span className="opacity-60">
          © Onírica · {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
