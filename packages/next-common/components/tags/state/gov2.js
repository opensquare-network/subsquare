import React, { useMemo } from "react";
import styled from "styled-components";
import { gov2State } from "../../../utils/consts/state";
import {
  ActiveTag,
  BaseTag,
  ClosedTag,
  NegativeTag,
  PositiveTag,
  StartTag,
} from "./styled";
import Tooltip from "next-common/components/tooltip";

const QueueingTag = styled(BaseTag)`
  background-color: var(--orange500);
`;

const gov2ReferendaTagMap = {
  [gov2State.Submitted]: StartTag,
  [gov2State.Preparing]: StartTag,
  [gov2State.Queueing]: QueueingTag,
  [gov2State.Deciding]: ActiveTag,
  [gov2State.Confirming]: PositiveTag,
  [gov2State.Approved]: PositiveTag,
  [gov2State.Cancelled]: NegativeTag,
  [gov2State.Killed]: NegativeTag,
  [gov2State.Timeout]: ClosedTag,
  [gov2State.TimedOut]: ClosedTag,
  [gov2State.Rejected]: NegativeTag,

  DecisionStarted: PositiveTag,
  DecisionDepositPlaced: PositiveTag,
  ConfirmStarted: PositiveTag,
  ConfirmAborted: NegativeTag,
  Confirmed: PositiveTag,
  Ongoing: StartTag,
};

const tooltipTextMap = {
  [gov2State.Submitted]:
    "Referendum has been submitted and is awaiting initial review",
  [gov2State.Preparing]: " Placing a decision deposit for the voting process",
  [gov2State.Queueing]: "Waiting in line for processing or voting to begin",
  [gov2State.Deciding]: "Currently open for voting",
  [gov2State.Confirming]: "Waiting for final checks before vote ends",
  [gov2State.Approved]: "Vote passed but action not yet executed",
  [gov2State.Executed]: "Vote passed and action taken",
  [gov2State.Cancelled]: "Proposal withdrawn before voting began",
  [gov2State.Killed]: "Manually removed before voting completed",
  [gov2State.Timeout]: "Vote did not complete in time",
  [gov2State.TimedOut]: "Vote did not complete in time",
  [gov2State.Rejected]: "Vote failed and referendum not pass",
  DecisionStarted: "Voting process has officially begun",
  DecisionDepositPlaced: "Required deposit submitted to initiate voting",
  ConfirmStarted: "Final checks in progress after successful vote",
  ConfirmAborted: "Final checks failed or were manually stopped",
  Confirmed: "All checks passed; ready for execution",
  Ongoing: "Process is active and awaiting next stage",
};

export function Gov2ReferendaTag({ state, args }) {
  let Tag = gov2ReferendaTagMap[state] || ClosedTag;

  if (state === gov2State.Executed) {
    Tag = args?.isOk ? PositiveTag : NegativeTag;
  }

  const tooltipText = useMemo(() => {
    return tooltipTextMap[state];
  }, [state]);

  if (tooltipTextMap) {
    return (
      <Tooltip content={tooltipText} contentClassName="max-w-[240px]">
        <Tag className="cursor-pointer">{state}</Tag>
      </Tooltip>
    );
  }

  return <Tag>{state}</Tag>;
}
