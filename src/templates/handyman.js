import { themes } from './shared/themes.js';
import { buildAssistantPrompt } from './shared/promptStyle.js';

export const HandymanTemplate = {
  name: 'FixRight Handyman',
  icon: '🔧',
  tagline: 'Electrical, plumbing & punch-list pros',
  description:
    'Describe the job — get a labor estimate, safety notes, and what to have ready before we arrive.',
  highlights: ['Licensed electricians', 'Upfront estimates', 'Same-day urgent'],
  theme: themes.trade,
  assistantName: 'FixRight',
  submitLabel: 'Get job estimate',

  form: () => [
    { id: 'sec_job', type: 'section', label: 'Job details' },
    {
      id: 'customerName',
      type: 'text',
      label: 'Name',
      required: true,
      placeholder: 'Sam Nguyen',
    },
    {
      id: 'jobType',
      type: 'select',
      label: 'Type of work',
      required: true,
      options: [
        { value: 'electrical', label: 'Electrical — outlets, fixtures, panels' },
        { value: 'plumbing', label: 'Plumbing — leaks, clogs, fixtures' },
        { value: 'general', label: 'General — assembly, drywall, doors' },
      ],
    },
    {
      id: 'location',
      type: 'text',
      label: 'Where is the issue?',
      hint: 'Room + what is broken helps us bring the right parts.',
      placeholder: 'e.g., Kitchen — GFCI outlet not working',
      required: true,
    },
    {
      id: 'description',
      type: 'textarea',
      label: 'Describe the problem',
      placeholder: 'What happened? Any error codes or photos to mention?',
    },
    { id: 'sec_timing', type: 'section', label: 'Timing' },
    {
      id: 'urgency',
      type: 'select',
      label: 'How urgent?',
      required: true,
      options: [
        { value: 'routine', label: 'Routine — this week is fine' },
        { value: 'soon', label: 'Soon — within 2 days' },
        { value: 'urgent', label: 'Urgent — safety issue (+50%)' },
      ],
    },
  ],

  prompt: (data) => {
    const baseRate = 75;
    const hours =
      data.jobType === 'electrical' ? 2 : data.jobType === 'plumbing' ? 1.5 : 1;
    const multiplier = data.urgency === 'urgent' ? 1.5 : data.urgency === 'soon' ? 1.15 : 1;
    const total = baseRate * hours * multiplier;

    return buildAssistantPrompt({
      persona: 'Diego, dispatch lead at FixRight Handyman & Electric',
      businessName: 'FixRight',
      voice: 'Direct and safety-first. Flag anything that needs a licensed specialist.',
      contextLines: [
        `Customer: ${data.customerName || 'Guest'}`,
        `Trade: ${data.jobType}`,
        `Location: ${data.location}`,
        `Details: ${data.description || 'Not provided'}`,
        `Urgency: ${data.urgency}`,
      ],
      pricingNotes: [
        `$${baseRate}/hr labor, ~${hours} hr estimated`,
        `Estimated labor: $${total.toFixed(2)} (parts quoted separately)`,
        data.urgency === 'urgent' ? 'Urgent dispatch surcharge applied.' : null,
      ],
      deliverables: [
        'Acknowledge the issue in plain language',
        'Estimated labor range and what affects final price',
        '2–3 safety steps until we arrive',
        'Expected timeline based on urgency',
        'What to have ready (breaker access, shut-off valves, clear workspace)',
      ],
      upsells: [
        data.jobType === 'electrical' ? 'GFCI upgrade for kitchen/bath (+$20 parts)' : null,
        'Annual home maintenance walkthrough',
      ],
    });
  },

  rules: {
    jobType: (value) =>
      value === 'electrical'
        ? '- Remind about GFCI in wet areas and permit needs for panel work.'
        : null,
    urgency: (value) =>
      value === 'urgent' ? '- Treat as priority dispatch; mention same-day if possible.' : null,
  },
};
