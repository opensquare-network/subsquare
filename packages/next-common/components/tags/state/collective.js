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
  ExecutedWithError: "Vote passed but call executed with error",
  Closed: "Voting ended with no further action",

  // timeline
  Voted: "Voter has submitted their choice",
  Vote: "A proposal open for decision-making",
};

export function CollectiveTag({ state, args }) {
  const { Tag, tooltipText } = useMemo(() => {
    let Tag = stateTagMap[state] || MotionTag;
    let tooltipText = tooltipTextMap[state];

    if ((state || "").startsWith("Voting")) {
      Tag = ActiveTag;
    }

    if ("Executed" === state && !args?.isOk) {
      Tag = NegativeTag;
      tooltipText = tooltipTextMap.ExecutedWithError;
    }

    return { Tag, tooltipText };
  }, [args?.isOk, state]);

  if (tooltipText) {
    return (
      <Tooltip content={tooltipText}>
        <Tag className="cursor-pointer" args={args}>
          {state}
        </Tag>
      </Tooltip>
    );
  }

  return <Tag args={args}>{state}</Tag>;
}
