import React from "react";
import { NegativeTag, PositiveTag, StartTag } from "./styled";

const stateTagMap = {
  Proposed: StartTag,
  Awarded: PositiveTag,
  Rejected: NegativeTag,
  ApproveVoting: PositiveTag,
  RejectVoting: NegativeTag,
};

export default function TreasuryTag({ state }) {
  const Tag = stateTagMap[state] || StartTag;
  return <Tag>{state}</Tag>;
}
