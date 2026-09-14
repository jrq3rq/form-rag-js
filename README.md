# form-rag-js

**One AI form. Any small business. Powered by Grok.**

Version **2.0** — branded templates, themed chat UI, server-friendly completions, and a fixed RAG conversation loop.

**New here?** See [Getting started](docs/GETTING_STARTED.md) for install, local demo, env vars, backend setup, and troubleshooting.

---

## Install

```bash
npm install form-rag-js
```

Import styles in your app (required):

```js
import 'form-rag-js/styles.css';
```

---

## Quick Start (recommended)

Call Grok from **your backend** and pass a `complete` function. Never ship API keys in the browser.

```jsx
import { FormRAG, LandscaperTemplate } from 'form-rag-js';
import 'form-rag-js/styles.css';

export function QuoteForm() {
  return (
    <FormRAG
      template={LandscaperTemplate}
      variant="embed"
      complete={async ({ messages }) => {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
        });
        if (!res.ok) throw new Error('Chat failed');
        const { content } = await res.json();
        return content;
      }}
      onLead={(lead) => console.log('New lead', lead)}
    />
  );
}
```

Example `/api/chat` handler (Node):

```js
import { createXaiComplete } from 'form-rag-js';

const complete = createXaiComplete({
  apiKey: process.env.GROK_API_KEY,
  model: 'grok-3-beta',
});

export async function POST(req) {
  const { messages } = await req.json();
  const content = await complete({ messages });
  return Response.json({ content });
}
```

---

## What you get

| Area | Behavior |
|------|----------|
| **Smart form** | Sections, hints, multi-selects, themed submit CTA |
| **Branded header** | Icon, tagline, description, highlight pills per template |
| **Chat UI** | Avatar bubbles, typing indicator, auto-growing composer, save/start over |
| **RAG loop** | Template prompt is a **system** message; users see a short form summary + chat |
| **Follow-ups** | Every turn keeps system prompt + full visible thread |
| **Themes** | Per-template CSS variables (`primary`, `surface`, …); `color-scheme: light` so host dark mode cannot wash out text |
| **Leads** | `onLead` + optional `exportFilename` / auto JSON download |
| **Clean text** | Markdown stripped from model replies |

---

## `<FormRAG />` props

| Prop | Description |
|------|-------------|
| `template` | Form + prompt template (required) |
| `complete` | `({ messages, formData }) => Promise<string>` |
| `apiKey` | Deprecated — use `createXaiComplete` on the server |
| `variant` | `'page'` (full viewport) or `'embed'` |
| `onLead` | Called when `template.exportLead` is defined |
| `onError` | Error handler |
| `autoDownloadLead` | Auto JSON download (default `true`) |
| `model` / `temperature` | Only used with deprecated `apiKey` |

---

## Included templates

| Export | Brand | Best for |
|--------|--------|----------|
| `LandscaperTemplate` | GreenScape Pro | Lawn quotes |
| `CleaningTemplate` | Sparkle & Co. | Home cleaning |
| `HandymanTemplate` | FixRight | Trade estimates |
| `AutomotiveTemplate` | Metro Auto Care | Diagnostics |
| `RealEstateTemplate` | Harbor Realty | Buy / sell snapshot |
| `AuthorTemplate` | StoryForge Studio | Book outlines |
| `ArtistTemplate` | Canvas & Clay | Commissions |
| `UniversalSMBTemplate` | Business Launchpad | Pick any vertical |

Pro (separate entry):

```js
import { RealEstateProTemplate } from 'form-rag-js/templates/pro';
```

Astra Concierge — lead capture, comps (`/api/comps` + fallbacks), JSON export.

---

## Build your own template

```js
export const CoffeeTemplate = {
  name: 'Harbor Roast',
  icon: '☕',
  tagline: 'Orders & pickup quotes',
  description: 'Tell us your drink — get a total and ready time.',
  highlights: ['Local beans', '2-min pickup'],
  theme: {
    primary: '#b45309',
    primaryDark: '#92400e',
    surface: '#fffbeb',
    accent: '#fde68a',
  },
  assistantName: 'Harbor Roast',
  submitLabel: 'Get my order quote',
  form: () => [
    { id: 'sec_order', type: 'section', label: 'Your order' },
    { id: 'drink', type: 'text', label: 'Drink', required: true, hint: 'Size + milk if needed' },
  ],
  prompt: (data) => `You are a barista. Order: ${data.drink}. Give total and pickup time. Plain text only.`,
  rules: { drink: (v) => (v === 'espresso' ? '- Offer pastry upsell' : null) },
  exportLead: (data, messages) => ({ lead: data, chat: messages }),
  exportFilename: (data) => `${data.drink}_lead.json`,
};
```

**Field types:** `text`, `email`, `tel`, `number`, `select`, `multi` / `multiselect`, `checkbox`, `textarea`, `section`.

**Optional template fields:** `icon`, `tagline`, `description`, `highlights`, `theme`, `assistantName`, `submitLabel`, `exportLead`, `exportFilename`, `initialUserMessage`.

---

## Headless mode

```js
import { constructPrompt } from 'form-rag-js';
import { RealEstateProTemplate } from 'form-rag-js/templates/pro';

const systemPrompt = await constructPrompt(formData, RealEstateProTemplate);
```

---

## Local development

```bash
# library
cd form-rag-js
npm install && npm test && npm run build

# optional sibling Vite demo (see Getting started)
cd ../form-rag-demo
npm install ../form-rag-js
echo 'VITE_GROK_API_KEY=xai-...' > .env
npm run dev
```

---

## Scripts

```bash
npm test
npm run build
npm run bundle
```

---

**form-rag-js** · MIT · [StudioVoice2Fly](https://studiovoice2fly.com)
