import { stripMarkdown } from './stripMarkdown.js';

const XAI_URL = 'https://api.x.ai/v1/chat/completions';

/**
 * Creates a `complete` function that calls the xAI chat API (use from your backend in production).
 */
export const createXaiComplete = ({
  apiKey,
  model = 'grok-3-beta',
  temperature = 0.7,
} = {}) => {
  if (!apiKey) {
    throw new Error('createXaiComplete requires apiKey');
  }

  return async ({ messages }) => {
    const res = await fetch(XAI_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, messages, temperature }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Chat API HTTP ${res.status}${body ? `: ${body.slice(0, 200)}` : ''}`);
    }

    const json = await res.json();
    const raw = json.choices?.[0]?.message?.content ?? '';
    return stripMarkdown(raw) || 'No response';
  };
};
