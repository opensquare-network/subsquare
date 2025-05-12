import React, { useMemo } from "react";
import {
  ActiveTag,
  ClosedTag,
  MotionTag,
  NegativeTag,
  PositiveTag,
  StartTag,
} from "./styled";
import Tooltip from "next-common/components/tooltip";

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

const tooltipTextMap = {
  Proposed: "Submitted and waiting to enter voting",
  Voting: "Voting in progress",
  Approved: "Vote passed successfully",
  Disapproved: "Vote failed to pass",
  Executed: "Vote passed and action taken",
  Closed: "Voting ended with no further action",

  // timeline
  Voted: "Voter has submitted their choice",
  Vote: "A proposal open for decision-making",
};

export function CollectiveTag({ state, args }) {
  let Tag = stateTagMap[state] || MotionTag;
  if ((state || "").startsWith("Voting")) {
    Tag = ActiveTag;
  }
  if ("Executed" === state && args?.isOk === false) {
    Tag = NegativeTag;
  }

  const tooltipText = useMemo(() => {
    return tooltipTextMap[state];
  }, [state]);

  if (tooltipText) {
    return (
      <Tooltip content={tooltipText}>
        <Tag className="cursor-pointer">{state}</Tag>
      </Tooltip>
    );
  }

  return <Tag args={args}>{state}</Tag>;
}
