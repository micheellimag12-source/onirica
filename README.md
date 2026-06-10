# 🌙 Onírica — Landing + Quiz + Prévia com IA

Análise personalizada de sonhos que une neurociência, psicologia profunda de Jung e
tradição bíblica. Esta aplicação cobre o **funil de captura**: landing page → quiz
de 22 perguntas com storytelling → prévia personalizada gerada por IA → checkout.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** · **Motion** (animações) · **lucide-react**
- **Zod** (validação) · **Claude API** (`@anthropic-ai/sdk`) para a prévia

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# edite .env.local e cole sua ANTHROPIC_API_KEY (veja abaixo)

# 3. Rodar em desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

Veja `.env.example`. Resumo:

| Variável | Obrigatória | O que é |
|---|---|---|
| `ANTHROPIC_API_KEY` | sim (para a prévia com IA) | Chave da Anthropic — pegue em https://console.anthropic.com/settings/keys |
| `ANTHROPIC_MODEL` | não (default `claude-opus-4-6`) | Modelo da prévia. `claude-sonnet-4-6` é o usado em produção (custo-benefício) |
| `NEXT_PUBLIC_CAKTO_CHECKOUT_URL` | não | URL do checkout (Cakto). Sem ela, o botão de compra mostra "em breve" |

> Sem `ANTHROPIC_API_KEY`, todo o quiz funciona normalmente, mas a tela de prévia
> mostra um erro tratado em vez da análise gerada.

## Como funciona o fluxo

`Landing` → `Intro` → `22 perguntas` (com telas-espelho de storytelling entre os
blocos) → `Gerando` (chama `/api/preview`) → `Prévia` (espelho + 1 insight + itens
bloqueados + CTA de checkout).

Arquitetura principal:

- `lib/quiz-config.ts` — as 22 perguntas
- `lib/quiz-state.ts` — máquina de estados do funil
- `lib/storytelling.ts` — telas-espelho (config-driven) que refletem as respostas
- `app/api/preview/route.ts` — geração da prévia com a Claude API (saída estruturada)
- `components/quiz/` — telas do quiz, geração e prévia

## Build de produção

```bash
npm run build && npm run start
```
