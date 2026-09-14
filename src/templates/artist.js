import { themes } from './shared/themes.js';
import { buildAssistantPrompt } from './shared/promptStyle.js';

export const ArtistTemplate = {
  name: 'Canvas & Clay Commissions',
  icon: '🎨',
  tagline: 'Custom art quotes & timelines',
  description:
    'Commission oil, digital, or sculpture — get materials, milestones, and pricing tailored to your brief.',
  highlights: ['Gallery represented', 'Revision rounds included', 'Worldwide shipping'],
  theme: themes.art,
  assistantName: 'Canvas & Clay',
  submitLabel: 'Request commission quote',

  form: () => [
    { id: 'sec_client', type: 'section', label: 'About you' },
    {
      id: 'clientName',
      type: 'text',
      label: 'Name',
      required: true,
      placeholder: 'Morgan Blake',
    },
    { id: 'sec_piece', type: 'section', label: 'The piece' },
    {
      id: 'medium',
      type: 'select',
      label: 'Medium',
      required: true,
      options: [
        { value: 'oil', label: 'Oil on canvas' },
        { value: 'digital', label: 'Digital illustration (print-ready)' },
        { value: 'sculpture', label: 'Sculpture / mixed media' },
        { value: 'portrait', label: 'Portrait from photo' },
      ],
    },
    {
      id: 'size',
      type: 'text',
      label: 'Size or format',
      hint: 'e.g., 24×36 in, or 4K wallpaper',
      placeholder: '24×36 inches',
      required: true,
    },
    {
      id: 'brief',
      type: 'textarea',
      label: 'Creative brief',
      placeholder: 'Mood, colors, reference images, deadline…',
    },
    {
      id: 'deadline',
      type: 'select',
      label: 'Deadline',
      options: [
        { value: 'flex', label: 'Flexible — quality first' },
        { value: '4w', label: 'Within 4 weeks (+15%)' },
        { value: '2w', label: 'Rush — 2 weeks (+30%)' },
      ],
    },
  ],

  prompt: (data) => {
    const baseByMedium = { oil: 650, digital: 350, sculpture: 1200, portrait: 480 };
    const base = baseByMedium[data.medium] ?? 400;
    const rush =
      data.deadline === '2w' ? 1.3 : data.deadline === '4w' ? 1.15 : 1;
    const total = base * rush;

    return buildAssistantPrompt({
      persona: 'Ava, studio manager at Canvas & Clay Commissions',
      businessName: 'Canvas & Clay',
      voice: 'Creative but business-clear. Set expectations on revisions and shipping.',
      contextLines: [
        `Client: ${data.clientName || 'Guest'}`,
        `Medium: ${data.medium}`,
        `Size / format: ${data.size}`,
        `Brief: ${data.brief || 'Open — propose direction'}`,
        `Deadline: ${data.deadline || 'flex'}`,
      ],
      pricingNotes: [
        `Starting commission estimate: $${total.toFixed(0)} (50% deposit to start)`,
        'Final price may shift after reference review.',
      ],
      deliverables: [
        'Reflect their brief back in one sentence',
        'Estimated price range and deposit amount',
        'Timeline with sketch → color → final milestones',
        'Materials or file formats they will receive',
        'What references to send next (photos, palette, mood board)',
      ],
      upsells: [
        data.medium === 'sculpture' ? 'Studio rental / casting coordination (+$200)' : null,
        'Framing or archival print add-on',
      ],
      closing: 'Ask them to reply YES to hold a studio slot and receive the contract summary.',
    });
  },

  rules: {
    medium: (value) =>
      value === 'sculpture' ? '- Mention mold/casting timeline and studio rental if needed.' : null,
    deadline: (value) =>
      value === '2w' ? '- Confirm rush fee and limited revision rounds.' : null,
  },
};
