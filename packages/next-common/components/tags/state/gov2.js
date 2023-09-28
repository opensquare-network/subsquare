import React from "react";
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

export function Gov2ReferendaTag({ state, args }) {
  let Tag = gov2ReferendaTagMap[state] || ClosedTag;

  if (state === gov2State.Executed) {
    Tag = args?.isOk ? PositiveTag : NegativeTag;
  }

  return <Tag>{state}</Tag>;
}
