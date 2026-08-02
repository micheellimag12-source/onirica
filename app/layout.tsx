import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { MetaPixel } from "@/components/MetaPixel";
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from "@/components/GoogleTagManager";

const cormorant = Cormorant_Garamond({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Onírica · Análise personalizada de sonhos",
  description:
    "Em 6 minutos, descubra o que seu sonho está realmente te dizendo. A primeira análise onírica brasileira que une neurociência, psicologia profunda e fé.",
  other: {
    // Verificação de domínio do Meta (Gerenciador de Negócios).
    "facebook-domain-verification": "5w4pv9si2kqv1vk8rjdb82ev8efaui",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1733",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <GoogleTagManager />
        <GoogleTagManagerNoScript />
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
