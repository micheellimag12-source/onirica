interface OniricaMarkProps {
  className?: string;
  size?: number;
}

export function OniricaMark({ className, size = 20 }: OniricaMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
    >
      <path
        d="M 50 6 Q 50 50 94 50 Q 50 50 50 94 Q 50 50 6 50 Q 50 50 50 6 Z"
        fill="currentColor"
      />
    </svg>
  );
}
