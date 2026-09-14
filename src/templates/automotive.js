import { themes } from './shared/themes.js';
import { buildAssistantPrompt } from './shared/promptStyle.js';

export const AutomotiveTemplate = {
  name: 'Metro Auto Care',
  icon: '🚗',
  tagline: 'Diagnostics & repair estimates',
  description:
    'Share your vehicle and symptoms — receive a likely diagnosis, parts ballpark, and appointment options.',
  highlights: ['ASE-certified techs', 'OEM & aftermarket parts', 'Loaner cars available'],
  theme: themes.auto,
  assistantName: 'Metro Auto',
  submitLabel: 'Get diagnostic estimate',

  form: () => [
    { id: 'sec_vehicle', type: 'section', label: 'Your vehicle' },
    {
      id: 'customerName',
      type: 'text',
      label: 'Name',
      required: true,
      placeholder: 'Chris Morgan',
    },
    {
      id: 'vehicle',
      type: 'text',
      label: 'Year / make / model',
      placeholder: 'e.g., 2019 Honda CR-V',
      required: true,
    },
    {
      id: 'mileage',
      type: 'number',
      label: 'Current mileage',
      hint: 'Helps us flag maintenance intervals.',
      placeholder: 'e.g., 82000',
      min: 0,
    },
    { id: 'sec_issue', type: 'section', label: 'What is going on?' },
    {
      id: 'issue',
      type: 'select',
      label: 'Primary concern',
      required: true,
      options: [
        { value: 'brakes', label: 'Brakes — noise, vibration, soft pedal' },
        { value: 'engine', label: 'Check engine / performance' },
        { value: 'tires', label: 'Tires, alignment, or suspension' },
        { value: 'ac', label: 'A/C or heating' },
        { value: 'other', label: 'Something else' },
      ],
    },
    {
      id: 'symptoms',
      type: 'textarea',
      label: 'Symptoms in your words',
      placeholder: 'When does it happen? Any lights on the dash?',
    },
  ],

  prompt: (data) => {
    const baseByIssue = {
      brakes: 320,
      engine: 180,
      tires: 220,
      ac: 260,
      other: 150,
    };
    const base = baseByIssue[data.issue] ?? 150;
    const mileage = Number(data.mileage) || 0;

    return buildAssistantPrompt({
      persona: 'Tanya, service advisor at Metro Auto Care',
      businessName: 'Metro Auto Care',
      voice: 'Clear and non-alarmist. Explain likely causes without overpromising.',
      contextLines: [
        `Customer: ${data.customerName || 'Guest'}`,
        `Vehicle: ${data.vehicle}`,
        `Mileage: ${mileage || 'Not provided'}`,
        `Concern: ${data.issue}`,
        `Symptoms: ${data.symptoms || 'Not described'}`,
      ],
      pricingNotes: [
        `Ballpark repair starting at $${base} (parts + labor vary by inspection)`,
        mileage > 100000 ? 'High mileage — recommend full inspection (+$80).' : null,
      ],
      deliverables: [
        'Summarize likely causes in plain English (2–3 bullets)',
        'Inspection + repair estimate range',
        'Typical parts that may be needed',
        'Suggested appointment slots (morning drop-off vs wait)',
        'What to bring (key, records, warranty info)',
      ],
      upsells: [
        mileage > 100000 ? 'Fluid service package and timing belt check' : null,
        'Complimentary multi-point inspection with repair',
      ],
    });
  },

  rules: {
    mileage: (value) => (value > 100000 ? '- Recommend full vehicle inspection.' : null),
    issue: (value) =>
      value === 'engine' ? '- Mention free code scan on first visit.' : null,
  },
};
