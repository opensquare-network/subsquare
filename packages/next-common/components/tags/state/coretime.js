import React from "react";
import { ClosedTag, StartTag } from "./styled";

const stateTagMap = {
  "Sale Start": StartTag,
  "Interlude End": ClosedTag,
  "Leadin End": ClosedTag,
  "Sale End": ClosedTag,
};

export function CoretimeSaleTimelineTag({ state }) {
  const Tag = stateTagMap[state] || ClosedTag;
  return <Tag>{state}</Tag>;
}
