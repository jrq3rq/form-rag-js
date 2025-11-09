// src/lib/stripMarkdown.js
/**
 * Removes common Markdown syntax while preserving line breaks.
 * Keeps the text readable for plain-text display / download.
 */
export const stripMarkdown = (text = '') => {
  return text
    .replace(/#{1,6}\s?/g, '')               // # headings
    .replace(/\*\*([^*]+)\*\*/g, '$1')       // **bold**
    .replace(/\*([^*]+)\*/g, '$1')           // *italic*
    .replace(/__([^_]+)__/g, '$1')           // __bold__
    .replace(/_([^_]+)_/g, '$1')             // _italic_
    .replace(/~~([^~]+)~~/g, '$1')           // ~~strikethrough~~
    .replace(/`([^`]+)`/g, '$1')             // `code`
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // [link text](url)
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1') // ![alt](url)
    .replace(/^[-*+]\s+/gm, '• ')            // unordered lists → bullet
    .replace(/^\d+\.\s+/gm, (m, i) => `${i}. `) // ordered lists
    .replace(/^\s*>/gm, '')                  // blockquotes
    .replace(/^\s*[-–—]{3,}\s*$/gm, '')      // horizontal rules
    .trim();
};