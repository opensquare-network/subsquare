import React from "react";
import {
  ActiveTag,
  ClosedTag,
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
};

export function CollectiveTag({ state }) {
  let Tag = stateTagMap[state] || ClosedTag;
  return <Tag>{state}</Tag>;
}
