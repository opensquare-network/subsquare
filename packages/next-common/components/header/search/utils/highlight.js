// The search service (meilisearch) marks the matched words of the highlighted
// fields with <em> tags. Parse a marked string into plain and highlighted
// segments, so that the UI can render it without any unsafe HTML.
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
