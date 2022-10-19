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

export function CollectiveTag({ state, args }) {
  let Tag = stateTagMap[state] || MotionTag;
  if ((state || "").startsWith("Voting")) {
    Tag = ActiveTag;
  }
  if ("Executed" === state && args?.isOk === false) {
    Tag = NegativeTag;
  }

  return <Tag args={args}>{state}</Tag>;
}
