import test from 'node:test';
import assert from 'node:assert/strict';
import { constructPrompt } from '../src/lib/promptEngine.js';
import { stripMarkdown } from '../src/lib/stripMarkdown.js';
import { formatFormSummary } from '../src/lib/formatFormSummary.js';

test('constructPrompt awaits async template prompts', async () => {
  const template = {
    prompt: async () => {
      await Promise.resolve();
      return 'System body';
    },
    rules: {},
  };
  const result = await constructPrompt({}, template);
  assert.equal(result, 'System body');
});

test('constructPrompt applies businessType rules', async () => {
  const template = {
    prompt: () => 'Base',
    rules: {
      landscaper: '- Lawn tip',
    },
  };
  const result = await constructPrompt({ businessType: 'landscaper' }, template);
  assert.match(result, /Lawn tip/);
});

test('stripMarkdown preserves ordered list numbers', () => {
  const out = stripMarkdown('1. First\n2. Second');
  assert.match(out, /1\. First/);
  assert.match(out, /2\. Second/);
});

test('formatFormSummary lists filled fields', () => {
  const summary = formatFormSummary(
    { yardSize: '2500', urgency: 'asap' },
    [
      { id: 'yardSize', type: 'number', label: 'Yard Size' },
      {
        id: 'urgency',
        type: 'select',
        label: 'Urgency',
        options: [{ value: 'asap', label: 'ASAP' }],
      },
    ],
  );
  assert.match(summary, /Yard Size: 2500/);
  assert.match(summary, /Urgency: ASAP/);
});
