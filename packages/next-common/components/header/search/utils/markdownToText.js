export default function markdownToText(value) {
  if (!value) return "";

  const patterns = {
    list: /^(\s*[-*+]\s+)/gm,
    headers: /^#{1,6}\s+/gm,
    bold: /\*\*(.*?)\*\*/g,
    italic: /(?<!\\)\*(?!\s)((?:\\.|[^\\])*?)(?<!\\)\*/g,
    math: {
      block: /\$\$(.*?)\$\$/gs,
      inline: /\$(.*?)\$/g,
    },
    code: /`{1,3}(.*?)`{1,3}/g,
    links: /\[([^\]]+)\]\([^)]+\)/g,
    images: /!\[([^\]]*)\]\([^)]+\)/g,
    newlines: /\n{2,}/g,
    whitespace: /^\s+|\s+$/g,
  };

  return value
    .replace(patterns.list, (match) => " ".repeat(match.length))
    .replace(patterns.headers, "")
    .replace(patterns.bold, "$1")
    .replace(patterns.italic, "$1")
    .replace(patterns.math.block, "$1")
    .replace(patterns.math.inline, "$1")
    .replace(patterns.code, "$1")
    .replace(patterns.links, "$1")
    .replace(patterns.images, "$1")
    .replace(patterns.newlines, "\n")
    .replace(patterns.whitespace, "");
}
