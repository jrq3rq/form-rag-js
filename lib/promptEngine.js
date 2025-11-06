// lib/promptEngine.js
/**
 * Builds a complete prompt from form data + template rules
 * Used by FormRAG to send to Grok
 */
export const constructPrompt = (formData, template) => {
  // Start with the base prompt from template
  let prompt = typeof template.prompt === 'function'
    ? template.prompt(formData)
    : template.prompt;

  // Add any dynamic rules (e.g. upsells, pricing logic)
  if (template.rules && typeof template.rules === 'object') {
    const selectedRules = [];

    // Loop through form fields to find rule triggers
    Object.keys(formData).forEach(fieldId => {
      const value = formData[fieldId];
      const rule = template.rules[fieldId];

      if (rule) {
        if (Array.isArray(value)) {
          // Handle multi-select (e.g. carePlans)
          value.forEach(val => {
            if (template.rules[val]) {
              selectedRules.push(template.rules[val]);
            }
          });
        } else if (typeof rule === 'function') {
          // Dynamic rule function
          const result = rule(value, formData);
          if (result) selectedRules.push(result);
        } else if (typeof rule === 'string') {
          // Static rule
          selectedRules.push(rule);
        }
      }
    });

    if (selectedRules.length > 0) {
      prompt += `\n\nGuidelines:\n` + selectedRules.join('\n');
    }
  }

  // Final safety: ensure prompt isn't empty
  return prompt.trim() || 'Generate response based on input.';
};