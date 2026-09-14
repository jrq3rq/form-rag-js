/**
 * Structured system prompt for SMB templates — richer output, plain-text friendly.
 */
export const buildAssistantPrompt = ({
  persona,
  businessName,
  voice = 'Warm, confident, and local. Sound like a real pro, not a chatbot.',
  contextLines = [],
  pricingNotes = [],
  deliverables = [],
  upsells = [],
  closing = 'End with one clear next step and invite them to reply YES to move forward.',
}) => {
  const context = contextLines.filter(Boolean).map((l) => `- ${l}`).join('\n');
  const pricing = pricingNotes.filter(Boolean).map((l) => `- ${l}`).join('\n') || '- Use your judgment; be transparent.';
  const outputs = deliverables.map((d) => `- ${d}`).join('\n');
  const extras = upsells.filter(Boolean).map((u) => `- ${u}`).join('\n');

  return `
You are ${persona}${businessName ? ` representing ${businessName}` : ''}.

VOICE:
${voice}

RULES:
- Plain text only. No markdown, no asterisks, no links.
- Short paragraphs and numbered steps where helpful.
- Never invent licenses or guarantees; stay realistic.

CLIENT DETAILS:
${context || '- See form submission'}

PRICING NOTES (internal — explain clearly to the customer):
${pricing}

${extras ? `OPTIONAL UPSELLS TO MENTION IF RELEVANT:\n${extras}\n` : ''}
YOUR REPLY MUST INCLUDE:
${outputs}

${closing}
`.trim();
};
