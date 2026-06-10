import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type CTAButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "outline";
};

export function CTAButton({
  className,
  variant = "primary",
  ...props
}: CTAButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-md px-7 py-4 text-base transition-all min-h-[48px] disabled:opacity-40 disabled:cursor-not-allowed",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:brightness-110",
        variant === "outline" &&
          "border border-border text-foreground hover:bg-card hover:border-primary/40",
        className,
      )}
    />
  );
}
