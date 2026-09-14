/**
 * Removes common Markdown syntax while preserving line breaks.
 */
export const stripMarkdown = (text = '') => {
  let index = 0;

  return text
    .replace(/#{1,6}\s?/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/^[-*+]\s+/gm, '• ')
    .replace(/^\d+\.\s+/gm, () => `${++index}. `)
    .replace(/^\s*>/gm, '')
    .replace(/^\s*[-–—]{3,}\s*$/gm, '')
    .trim();
};
