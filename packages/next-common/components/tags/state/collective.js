import React from "react";
import {
  ActiveTag,
  ClosedTag,
  MotionTag,
  NegativeTag,
  PositiveTag,
  StartTag,
} from "./styled";

const stateTagMap = {
  Proposed: StartTag,
  Voting: ActiveTag,
  Approved: PositiveTag,
  Disapproved: NegativeTag,
  Executed: PositiveTag,
  Closed: ClosedTag,

  // timeline
  Voted: MotionTag,
  Vote: MotionTag,
};

export function CollectiveTag({ state }) {
  let Tag = stateTagMap[state] || MotionTag;
  if ((state || "").startsWith("Voting")) {
    Tag = ActiveTag;
  }

  return <Tag>{state}</Tag>;
}
