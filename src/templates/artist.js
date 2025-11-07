// templates/artist.js
export const ArtistTemplate = {
  name: "Visual Artist AI Assistant",
  form: () => [
    {
      id: "medium",
      type: "select",
      label: "Medium",
      required: true,
      options: [
        { value: "oil", label: "Oil Painting" },
        { value: "digital", label: "Digital Art" },
        { value: "sculpture", label: "Sculpture" },
      ],
    },
    {
      id: "size",
      type: "text",
      label: "Project Size (e.g., 24x36 inches)",
      placeholder: "e.g., 24x36",
      required: true,
    },
    {
      id: "brief",
      type: "textarea",
      label: "Client Brief",
      placeholder: "e.g., Abstract in blues",
    },
  ],
  prompt: (data) => {
    const cost = data.medium === "oil" ? 500 : data.medium === "digital" ? 300 : 800;
    return `You are a visual artist assistant. Medium: ${data.medium}. Size: ${data.size}. Brief: ${data.brief || 'TBD'}. Generate material list, timeline, and pricing quote. End with "Reply with your thoughts or YES to start."`;
  },
  rules: {
    medium: (value) => value === "sculpture" ? "- Suggest studio rental (+$200)." : null,
  },
};