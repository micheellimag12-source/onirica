import type { LucideIcon } from "lucide-react";

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  body: string;
}

export function BenefitCard({ icon: Icon, title, body }: BenefitCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <span className="flex size-11 items-center justify-center rounded-full border border-primary/25 bg-primary/10">
        <Icon className="size-5 text-primary" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h3 className="font-display text-xl leading-tight text-foreground">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-foreground/70">{body}</p>
    </div>
  );
}
