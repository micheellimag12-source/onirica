/** Dispara um evento do Meta Pixel com segurança (no-op se o fbq não carregou). */
type Fbq = (cmd: string, event: string, params?: Record<string, unknown>) => void;

export function fbqTrack(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq === "function") fbq("track", event, params);
}
