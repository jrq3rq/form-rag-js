/**
 * Builds a short user-facing summary from form submission (not the system prompt).
 */
export const formatFormSummary = (formData, fields = []) => {
  const lines = [];

  for (const field of fields) {
    if (field.type === 'section') continue;

    const value = formData[field.id];
    if (value === undefined || value === null || value === '') continue;

    if (field.type === 'checkbox' && !field.options) {
      if (value) lines.push(`${field.label}: Yes`);
      continue;
    }

    if (Array.isArray(value)) {
      if (value.length) lines.push(`${field.label}: ${value.join(', ')}`);
      continue;
    }

    const optionLabel = field.options?.find((o) => o.value === value)?.label;
    lines.push(`${field.label}: ${optionLabel ?? value}`);
  }

  if (!lines.length) return 'I submitted the form. Please help me with next steps.';
  return `Here are my details:\n${lines.map((l) => `- ${l}`).join('\n')}`;
};
