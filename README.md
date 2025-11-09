# form-rag-js

**One AI form. Any small business. Powered by Grok.**

---

## Install

```bash
npm install form-rag-js
```

---

## Quick Start

```jsx
import { FormRAG } from 'form-rag-js';
import { RealEstateProTemplate } from 'form-rag-js/templates/pro';

<FormRAG template={RealEstateProTemplate} apiKey={process.env.GROK_API_KEY} />
```

---

## What You Get

| Feature | Details |
|--------|--------|
| **Smart Form** | Adapts fields based on input |
| **AI Chat** | Full conversation with Grok |
| **Lead Export** | Auto-downloads `.json` on submit |
| **Clean Output** | No `**`, `###`, or links — plain text |
| **Downloads** | Per-message or full chat (`.txt`) |

---

## Key Exports

| Export | Use |
|------|-----|
| `<FormRAG />` | Drop-in React component |
| `constructPrompt()` | Build RAG prompts manually |
| `UniversalSMBTemplate` | Pick business → auto-form |
| `*Template` | Ready-to-use SMB agents |
| `RealEstateProTemplate` | **Pro real estate** with comps + export |

---

## Pro Template: `RealEstateProTemplate`

```js
import { RealEstateProTemplate } from 'form-rag-js/templates/pro';
```

- **Captures**: Name, email, phone, ZIP, budget, timeline
- **Generates**: Mini-CMA with **live comps** (`/api/comps`)
- **Exports**: `Jane_Doe_realestate_pro.json`
- **Clean**: No Markdown
- **Rules**: Flags luxury, prioritizes ASAP

---

## Build Your Own Template

```js
// templates/coffee.js
export const CoffeeTemplate = {
  name: "Coffee Order",
  form: () => [/* fields */],
  prompt: (data) => `Order: ${data.drink}... Total: $${total}`,
  rules: { size: (v) => v === "large" ? "- Add pastry" : null },
  exportLead: (data, messages) => ({ lead: data, chat: messages })
};
```

```jsx
import { CoffeeTemplate } from './templates/coffee.js';
<FormRAG template={CoffeeTemplate} apiKey="..." />
```

---

## Included Templates

| Template | Best For |
|--------|---------|
| `UniversalSMBTemplate` | Pick any business |
| `LandscaperTemplate` | Lawn care |
| `CleaningTemplate` | Room pricing |
| `HandymanTemplate` | Job estimates |
| `AutomotiveTemplate` | Diagnostics |
| `RealEstateTemplate` | Basic real estate |
| `RealEstateProTemplate` | **Pro real estate + comps + export** |

---

## Headless Mode

```js
import { constructPrompt } from 'form-rag-js';
import { RealEstateProTemplate } from 'form-rag-js/templates/pro';

const prompt = constructPrompt(formData, RealEstateProTemplate);
// Use in serverless, email, etc.
```

---

## Get API Key

[https://console.x.ai](https://console.x.ai) → `grok-3-beta`

---

**form-rag-js**
© 2025 [StudioVoice2Fly](https://studiovoice2fly.com) • [MIT License](./LICENSE)

> **Start with a template. End with a business engine.**
