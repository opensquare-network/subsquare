import { ClosedTag, ActiveTag } from "./styled";
import React from "react";

const tagMap = {
  Ongoing: ActiveTag,
  Closed: ClosedTag,
};

export default function DvStatusTag({ state }) {
  const Tag = tagMap[state] || ClosedTag;
  return <Tag>{state}</Tag>;
}
