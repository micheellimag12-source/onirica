import type { LucideIcon } from "lucide-react";

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  body: string;
}

export function BenefitCard({ icon: Icon, title, body }: BenefitCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-6 flex flex-col gap-3">
      <Icon
        className="size-5 text-primary"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <h3 className="font-display text-xl text-foreground leading-tight">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
