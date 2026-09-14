const applyRules = (formData, template) => {
  if (!template.rules || typeof template.rules !== 'object') return [];

  const selected = [];

  Object.entries(formData).forEach(([fieldId, value]) => {
    if (value === undefined || value === null || value === '') return;

    const rule = template.rules[fieldId];
    if (!rule) return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (template.rules[v]) selected.push(template.rules[v]);
      });
    } else if (typeof rule === 'function') {
      const res = rule(value, formData);
      if (res) selected.push(res);
    } else if (typeof rule === 'string') {
      selected.push(rule);
    }
  });

  // Business-type rules (e.g. UniversalSMBTemplate keys by vertical id)
  const businessType = formData.businessType;
  if (businessType && typeof template.rules[businessType] === 'string') {
    selected.push(template.rules[businessType]);
  }

  return selected;
};

/**
 * Builds the system prompt for a template (async-safe for comps / enrichment).
 */
export const constructPrompt = async (formData, template) => {
  let prompt =
    typeof template.prompt === 'function'
      ? await template.prompt(formData)
      : template.prompt;

  if (typeof prompt !== 'string') {
    prompt = String(prompt ?? '');
  }

  const guidelines = applyRules(formData, template);
  if (guidelines.length) {
    prompt += `\n\nGuidelines:\n${guidelines.join('\n')}`;
  }

  return prompt.trim() || 'Generate a helpful response based on the customer input.';
};
