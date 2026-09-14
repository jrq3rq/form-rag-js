import { themes } from './shared/themes.js';
import { buildAssistantPrompt } from './shared/promptStyle.js';

export const LandscaperTemplate = {
  name: 'GreenScape Pro',
  icon: '🌿',
  tagline: 'Instant lawn care quotes & scheduling',
  description:
    'Tell us about your yard — get a itemized quote, recommended visit window, and prep checklist in under a minute.',
  highlights: ['Same-week visits', 'Licensed & insured', 'Eco-friendly options'],
  theme: themes.lawn,
  assistantName: 'GreenScape',
  submitLabel: 'Get my lawn quote',

  form: () => [
    { id: 'sec_property', type: 'section', label: 'Your property' },
    {
      id: 'customerName',
      type: 'text',
      label: 'Name',
      placeholder: 'Alex Rivera',
      required: true,
    },
    {
      id: 'yardSize',
      type: 'number',
      label: 'Yard size (sq ft)',
      hint: 'Rough estimate is fine — we can adjust after a quick walkthrough.',
      placeholder: 'e.g., 2500',
      required: true,
      min: 100,
      max: 50000,
    },
    { id: 'sec_services', type: 'section', label: 'Services & timing' },
    {
      id: 'services',
      type: 'multi',
      label: 'What do you need?',
      options: [
        { value: 'mowing', label: 'Weekly mowing ($0.03/sq ft)' },
        { value: 'trimming', label: 'Trimming & edging (+$25)' },
        { value: 'fertilizer', label: 'Fertilizer treatment (+$0.01/sq ft)' },
        { value: 'aeration', label: 'Core aeration (+$50)' },
      ],
    },
    {
      id: 'urgency',
      type: 'select',
      label: 'When should we come?',
      required: true,
      options: [
        { value: 'weekend', label: 'Weekend — best for me' },
        { value: 'weekday', label: 'Weekday — before 5pm' },
        { value: 'asap', label: 'ASAP rush (+20%)' },
      ],
    },
  ],

  prompt: (data) => {
    const yard = Number(data.yardSize) || 0;
    const base = yard * 0.03;
    const extras = (data.services || []).reduce((sum, s) => {
      if (s === 'trimming') return sum + 25;
      if (s === 'fertilizer') return sum + yard * 0.01;
      if (s === 'aeration') return sum + 50;
      return sum;
    }, 0);
    const multiplier = data.urgency === 'asap' ? 1.2 : 1;
    const total = (base + extras) * multiplier;

    return buildAssistantPrompt({
      persona: 'Marcus, senior estimator at GreenScape Pro lawn & landscape',
      businessName: 'GreenScape Pro',
      voice:
        'Friendly neighbor energy. Mention seasonal tips (watering, mulch) when relevant.',
      contextLines: [
        `Customer: ${data.customerName || 'Guest'}`,
        `Yard: ${yard} sq ft`,
        `Services requested: ${(data.services || []).join(', ') || 'Basic mowing'}`,
        `Preferred timing: ${data.urgency}`,
      ],
      pricingNotes: [
        `Mowing base: $${base.toFixed(2)}`,
        `Add-ons: $${extras.toFixed(2)}`,
        `Estimated total (before tax): $${total.toFixed(2)}`,
        data.urgency === 'asap' ? 'Rush fee (+20%) included in total.' : null,
      ],
      deliverables: [
        'Greeting using their name',
        'Line-item quote with the estimated total',
        'Suggested visit day/time based on urgency',
        '2–3 prep tips (pets, gates, sprinklers)',
        'One optional upsell only if it fits their yard size',
      ],
      upsells: [
        yard > 5000 ? 'Core aeration for large lawns' : null,
        'Seasonal weed control bundle',
      ],
    });
  },

  rules: {
    yardSize: (value) =>
      value > 5000 ? '- Mention aeration and seasonal weed control for large yards.' : null,
    urgency: (value) => (value === 'asap' ? '- Offer first available slot within 48 hours.' : null),
  },
};
