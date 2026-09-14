# Getting started with form-rag-js

This guide covers everything you need to **download**, **install**, **configure**, and **run** form-rag-js—whether you consume the npm package in your own app or hack on the library from a git clone.

For a shorter API overview, see the [README](../README.md).

---

## What you are setting up

form-rag-js is a **React component library** (not a standalone server). It renders a branded business form, turns answers into a system prompt for **Grok** (xAI), opens a themed chat thread, and optionally exports leads.

You need:

| Requirement | Notes |
|-------------|--------|
| **Node.js** | 18+ recommended (native `fetch`, `node --test`) |
| **npm** (or pnpm/yarn) | To install packages |
| **A React app** | React 16.8+ (`peerDependencies`) |
| **Grok API key** | From [xAI Console](https://console.x.ai) — keep on the **server** in production |

Optional:

| Requirement | When |
|-------------|------|
| **`/api/comps` route** | Only for `RealEstateProTemplate` live comps (fallbacks work without it) |

---

## Path A — Use the published package

### 1. Install

```bash
npm install form-rag-js react react-dom
```

### 2. Import component, styles, and a template

```jsx
import { FormRAG, LandscaperTemplate } from 'form-rag-js';
import 'form-rag-js/styles.css';
```

Pro template:

```jsx
import { RealEstateProTemplate } from 'form-rag-js/templates/pro';
```

**Always import `form-rag-js/styles.css`.** Without it, layout and chat bubbles will look broken. Styles are scoped under `.form-rag` and force `color-scheme: light` so OS dark mode cannot turn form text white on white.

### 3. Backend chat route (recommended)

Do **not** pass `apiKey` in production—anyone can read it from the browser.

**Frontend:**

```jsx
<FormRAG
  template={LandscaperTemplate}
  variant="embed"
  complete={async ({ messages }) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error('Chat request failed');
    const { content } = await res.json();
    return content;
  }}
/>
```

**Express-style backend:**

```js
import express from 'express';
import { createXaiComplete } from 'form-rag-js';

const app = express();
app.use(express.json());

const complete = createXaiComplete({
  apiKey: process.env.GROK_API_KEY,
  model: process.env.GROK_MODEL || 'grok-3-beta',
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const content = await complete({ messages });
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000);
```

```bash
export GROK_API_KEY="xai-..."
node server.js
```

**Next.js App Router** (`app/api/chat/route.js`):

```js
import { createXaiComplete } from 'form-rag-js';

const complete = createXaiComplete({
  apiKey: process.env.GROK_API_KEY,
  model: 'grok-3-beta',
});

export async function POST(request) {
  const { messages } = await request.json();
  const content = await complete({ messages });
  return Response.json({ content });
}
```

`.env.local` (never commit):

```env
GROK_API_KEY=xai-your-key-here
```

**Vite** proxy if the API is on another port:

```js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
};
```

### 4. Run

```bash
npm run dev
```

Fill the form → submit (custom label per template, e.g. “Get my lawn quote”) → chat with avatars, typing indicator, and composer (Enter to send, Shift+Enter for newline).

### 5. Quick local demo only (not production)

```jsx
<FormRAG
  template={LandscaperTemplate}
  variant="page"
  apiKey={import.meta.env.VITE_GROK_API_KEY}
/>
```

```env
VITE_GROK_API_KEY=xai-...
```

Restart Vite after changing `.env`. The key is visible to anyone who loads the page.

---

## Path B — Clone the library + sibling demo

### 1. Clone and build the package

```bash
git clone https://github.com/jrq3rq/form-rag-js.git
cd form-rag-js
npm install
npm test
npm run build
```

### 2. Create a Vite demo (once)

```bash
cd ..
npm create vite@latest form-rag-demo -- --template react
cd form-rag-demo
npm install
npm install ../form-rag-js
```

Use a single default export in `src/App.jsx` (Vite scaffolds sometimes leave two). A working pattern:

```jsx
import { useMemo, useState } from 'react';
import {
  FormRAG,
  LandscaperTemplate,
  CleaningTemplate,
  // …other templates
} from 'form-rag-js';
import 'form-rag-js/styles.css';

export default function App() {
  return (
    <FormRAG
      template={LandscaperTemplate}
      variant="page"
      apiKey={import.meta.env.VITE_GROK_API_KEY}
    />
  );
}
```

```bash
echo 'VITE_GROK_API_KEY=xai-your-real-key' > .env
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### 3. After editing the library

```bash
cd ../form-rag-js && npm run build
cd ../form-rag-demo && npm install ../form-rag-js
```

Hard-refresh the browser. Prefer `file:../form-rag-js` in `package.json` over a stale `npm link` when styles look outdated.

### 4. Optional: `npm link`

```bash
# in form-rag-js
npm run build && npm link
# in your app
npm link form-rag-js
```

### 5. Maintainers: release

```bash
npm run release
```

Build, bundle, version, push, publish (see `package.json`).

---

## Environment variables

| Variable | Where | Purpose |
|----------|--------|---------|
| `GROK_API_KEY` | Server | xAI auth for `createXaiComplete` |
| `GROK_MODEL` | Server (optional) | Default `grok-3-beta` |
| `VITE_GROK_API_KEY` | Vite demo only | Deprecated client `apiKey` prop |

Never commit `.env*`. The library `.gitignore` already excludes them.

---

## Chat UI (what to expect)

After submit:

- Compact branded header (icon / name / tagline)
- Scrollable message list with **avatars** and **bubbles**
- **Typing** animation while waiting on the model
- Toolbar: **Save chat**, **Start over**
- Composer: auto-growing textarea, Enter to send
- Per-message **Save**
- Responsive layout (narrow viewports wrap bubbles; no horizontal overflow)

Long replies wrap with `overflow-wrap: anywhere`. Container widens slightly in chat mode.

---

## Real Estate Pro: comps API

```http
GET /api/comps?zip=90210&type=house&budget=750000
```

```json
[
  { "address": "123 Oak St", "price": 735000, "beds": 3, "baths": 2, "sqft": 1850, "daysAgo": 14 }
]
```

On failure, built-in fallback comps are used so demos still run.

---

## Project layout

```text
form-rag-js/
├── src/
│   ├── index.js
│   ├── components/
│   │   ├── FormRAG.jsx       # Form + chat UI
│   │   └── FormRAG.css       # Scoped / themed styles → styles.css export
│   ├── lib/
│   │   ├── promptEngine.js
│   │   ├── chatClient.js
│   │   ├── formatFormSummary.js
│   │   ├── stripMarkdown.js
│   │   ├── templateTheme.js
│   │   └── compsAPI.js
│   ├── templates/
│   │   ├── shared/           # themes + prompt helpers
│   │   ├── *.js              # SMB templates
│   │   └── pro/              # RealEstateProTemplate
│   └── types/template.d.ts
├── test/
├── dist/                     # after npm run build
├── docs/
│   └── GETTING_STARTED.md
├── package.json
└── README.md
```

---

## Included templates

| Export | Brand |
|--------|--------|
| `UniversalSMBTemplate` | Business Launchpad |
| `LandscaperTemplate` | GreenScape Pro |
| `CleaningTemplate` | Sparkle & Co. |
| `HandymanTemplate` | FixRight |
| `AutomotiveTemplate` | Metro Auto Care |
| `RealEstateTemplate` | Harbor Realty |
| `AuthorTemplate` | StoryForge Studio |
| `ArtistTemplate` | Canvas & Clay |
| `RealEstateProTemplate` | Astra Concierge (`form-rag-js/templates/pro`) |

Each ships `icon`, `tagline`, `description`, `highlights`, `theme`, `assistantName`, and `submitLabel`.

---

## `<FormRAG />` props

| Prop | Required | Description |
|------|----------|-------------|
| `template` | Yes | Form + prompt (+ optional branding / theme) |
| `complete` | Recommended | Returns assistant text |
| `apiKey` | No (deprecated) | Browser → xAI directly |
| `variant` | No | `'page'` or `'embed'` |
| `onLead` | No | When `exportLead` exists |
| `onError` | No | Error callback |
| `autoDownloadLead` | No | Default `true` |
| `model`, `temperature` | No | With deprecated `apiKey` only |

---

## Custom template shape

```js
{
  name, icon, tagline, description, highlights,
  theme: { primary, primaryDark, surface, accent },
  assistantName, submitLabel,
  form: () => [ /* fields */ ],
  prompt: (data) => `...` | async (data) => `...`,
  rules: { fieldId: string | (value, data) => string | null },
  exportLead, exportFilename, initialUserMessage,
}
```

**Field types:** `text`, `email`, `tel`, `number`, `select`, `multi` / `multiselect`, `checkbox`, `textarea`, `section` (visual divider only).

Optional per field: `hint`, `placeholder`, `required`, `min`, `max`, `step`, `options`.

---

## Headless usage

```js
import { constructPrompt, LandscaperTemplate } from 'form-rag-js';

const systemPrompt = await constructPrompt(formData, LandscaperTemplate);
```

---

## Troubleshooting

### White / invisible text in inputs

Host app likely sets `color-scheme: dark`. Current FormRAG CSS forces light scheme inside `.form-rag`. Rebuild (`npm run build`) and reinstall the local package; hard-refresh. Confirm `import 'form-rag-js/styles.css'`.

### `A module cannot have multiple default exports`

`App.jsx` has both `export default function App()` and `export default App`. Keep one.

### `FormRAG requires complete callback or apiKey`

Pass `complete` or (demo-only) `apiKey`.

### Chat HTTP 401 / 403

Bad or missing server `GROK_API_KEY`.

### Styles broken / global bleed

Import `form-rag-js/styles.css`. Use `variant="embed"` inside an existing layout.

### `constructPrompt` is async

Always `await constructPrompt(...)`.

### Comps look identical every time

`/api/comps` failed; fallbacks are in use.

### Chat looks outdated after library edits

Rebuild + reinstall the local package, then hard-refresh (CSS is easy to cache).

### TypeScript

Types: `src/types/template.d.ts` via package `"types"`.

---

## Checklist: first successful run

1. [ ] Node 18+ (`node -v`)
2. [ ] React app or `form-rag-demo`
3. [ ] `npm install form-rag-js` (or `../form-rag-js`)
4. [ ] `import 'form-rag-js/styles.css'`
5. [ ] Key in server env **or** `VITE_GROK_API_KEY` for local-only
6. [ ] `/api/chat` with `createXaiComplete` (production)
7. [ ] `<FormRAG />` on a page
8. [ ] Submit form → chat bubbles appear → follow-up works

---

## Links

- **npm:** `form-rag-js`
- **Repo:** [github.com/jrq3rq/form-rag-js](https://github.com/jrq3rq/form-rag-js)
- **Grok keys:** [console.x.ai](https://console.x.ai)
- **License:** MIT ([LICENSE](../LICENSE))
