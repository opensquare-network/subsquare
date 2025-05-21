import { ClosedTag, NegativeTag, PositiveTag } from "./styled";
import React from "react";
import Tooltip from "next-common/components/tooltip";

const tagMap = {
  Announced: PositiveTag,
  Removed: NegativeTag,
};

const tooltipContent = {
  Announced: "Proposal has been publicly declared",
  Removed: "Proposal has been removed from the process",
};

export default function AnnouncementTag({ state }) {
  const Tag = tagMap[state] || ClosedTag;
  return (
    <Tooltip content={tooltipContent[state]}>
      <Tag>{state}</Tag>
    </Tooltip>
  );
}
