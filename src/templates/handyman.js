// templates/handyman.js
export const HandymanTemplate = {
  name: "Handyman & Electrician AI Assistant",
  form: () => [
    {
      id: "jobType",
      type: "select",
      label: "Job Type",
      required: true,
      options: [
        { value: "electrical", label: "Electrical (e.g., wiring)" },
        { value: "plumbing", label: "Plumbing (e.g., leak fix)" },
        { value: "general", label: "General (e.g., assembly)" },
      ],
    },
    {
      id: "location",
      type: "text",
      label: "Location (inside/outside)",
      placeholder: "e.g., Kitchen outlet",
      required: true,
    },
    {
      id: "urgency",
      type: "select",
      label: "Urgency",
      options: [
        { value: "routine", label: "Routine" },
        { value: "urgent", label: "Urgent (+50%)" },
      ],
    },
  ],
  prompt: (data) => {
    const baseRate = 75; // $75/hr
    const hours = data.jobType === "electrical" ? 2 : data.jobType === "plumbing" ? 1.5 : 1;
    const total = baseRate * hours * (data.urgency === "urgent" ? 1.5 : 1);
    return `You are a handyman/electrician. Job: ${data.jobType}. Location: ${data.location}. Urgency: ${data.urgency}. Estimated hours: ${hours}. Total: $${total}. Generate a detailed quote, safety tips, and timeline. End with "Reply with your thoughts or YES to book."`;
  },
  rules: {
    jobType: (value) => value === "electrical" ? "- Recommend GFCI outlet (+$20)." : null,
  },
};