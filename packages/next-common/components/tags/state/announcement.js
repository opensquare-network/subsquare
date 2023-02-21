import { ClosedTag, NegativeTag, PositiveTag } from "./styled";
import React from "react";

const tagMap = {
  Announced: PositiveTag,
  Removed: NegativeTag,
};

export default function AnnouncementTag({ state }) {
  const Tag = tagMap[state] || ClosedTag;
  return <Tag>{state}</Tag>;
}
