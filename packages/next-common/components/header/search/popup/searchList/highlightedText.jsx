import { Fragment } from "react";
import { parseHighlightSegments } from "next-common/components/header/search/utils/highlight";

// Renders a field whose matched words are marked by the search service
// (meilisearch) with <em> tags. The matches keep the font color and are set
// off with a light yellow background and a slight rounding only.
export default function HighlightedText({ text, highlight }) {
  if (!highlight) {
    return text;
  }

  return parseHighlightSegments(highlight).map((segment, index) =>
    segment.highlight ? (
      <span key={index} className="bg-orange100 rounded-[2px]">
        {segment.text}
      </span>
    ) : (
      <Fragment key={index}>{segment.text}</Fragment>
    ),
  );
}
