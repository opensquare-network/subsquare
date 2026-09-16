// Meilisearch marks matched words with <em> tags.
export function parseHighlightSegments(value) {
  if (!value) {
    return [];
  }

  const segments = [];
  const regex = /<em>([\s\S]*?)<\/em>/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(value)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: value.slice(lastIndex, match.index),
        highlight: false,
      });
    }
    segments.push({ text: match[1], highlight: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < value.length) {
    segments.push({ text: value.slice(lastIndex), highlight: false });
  }

  return segments;
}
