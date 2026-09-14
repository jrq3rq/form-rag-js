const DEFAULTS = {
  primary: '#1da1f2',
  primaryDark: '#0d8bd9',
  surface: '#f8fafc',
  accent: '#e0f2fe',
};

/** Maps template.theme object to inline CSS variables for FormRAG. */
export const themeToStyle = (theme) => {
  const t = { ...DEFAULTS, ...theme };
  return {
    '--form-rag-primary': t.primary,
    '--form-rag-primary-dark': t.primaryDark,
    '--form-rag-surface': t.surface,
    '--form-rag-accent': t.accent,
  };
};
