import { Fragment } from "react";
import { parseHighlightSegments } from "next-common/components/header/search/utils/highlight";

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
