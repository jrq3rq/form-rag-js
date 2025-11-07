// lib/promptEngine.js
export const constructPrompt = (formData, template) => {
  let prompt = typeof template.prompt === "function"
    ? template.prompt(formData)
    : template.prompt;

  if (template.rules && typeof template.rules === "object") {
    const selected = [];

    Object.entries(formData).forEach(([fieldId, value]) => {
      if (!value || value === '') return;

      const rule = template.rules[fieldId];
      if (!rule) return;

      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (template.rules[v]) selected.push(template.rules[v]);
        });
      } else if (typeof rule === "function") {
        const res = rule(value, formData);
        if (res) selected.push(res);
      } else if (typeof rule === "string") {
        selected.push(rule);
      }
    });

    if (selected.length) {
      prompt += `\n\nGuidelines:\n${selected.join("\n")}`;
    }
  }

  return prompt.trim() || "Generate response based on input.";
};