// templates/author.js
export const AuthorTemplate = {
  name: "Book Author AI Assistant",
  form: () => [
    {
      id: "genre",
      type: "select",
      label: "Genre",
      required: true,
      options: [
        { value: "fiction", label: "Fiction" },
        { value: "nonfiction", label: "Non-Fiction" },
        { value: "memoir", label: "Memoir" },
      ],
    },
    {
      id: "wordGoal",
      type: "number",
      label: "Word Count Goal",
      placeholder: "e.g., 80000",
      required: true,
    },
    {
      id: "plot",
      type: "textarea",
      label: "Brief Plot Summary",
      placeholder: "e.g., A young wizard discovers...",
    },
  ],
  prompt: (data) => {
    const structure = data.genre === "fiction" ? "3-act structure" : "Chapter outline";
    return `You are a book author coach. Genre: ${data.genre}. Goal: ${data.wordGoal} words. Plot: ${data.plot || 'TBD'}. Generate a detailed outline, chapter breakdown, and productivity tips. End with "Reply with your thoughts or YES to start writing."`;
  },
  rules: {
    wordGoal: (value) => value > 100000 ? "- Suggest editor review (+$500)." : null,
  },
};