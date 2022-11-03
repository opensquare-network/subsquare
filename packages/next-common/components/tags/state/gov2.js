import styled from "styled-components";
import {
  ActiveTag,
  BaseTag,
  ClosedTag,
  NegativeTag,
  PositiveTag,
  StartTag,
} from "./styled";

const QueueingTag = styled(BaseTag)`
  background-color: ${(p) => p.theme.secondaryYellow500};
`;

const gov2State = {
  Submitted: "Submitted",
  Queueing: "Queueing",
  Deciding: "Deciding",
  Confirming: "Confirming",
  Approved: "Approved",
  Cancelled: "Cancelled",
  Killed: "Killed",
  Timeout: "Timeout",
  Rejected: "Rejected",
  Executed: "Executed",
};

const gov2ReferendaTagMap = {
  [gov2State.Submitted]: StartTag,
  [gov2State.Queueing]: QueueingTag,
  [gov2State.Deciding]: ActiveTag,
  [gov2State.Confirming]: ActiveTag,
  [gov2State.Approved]: PositiveTag,
  [gov2State.Cancelled]: NegativeTag,
  [gov2State.Killed]: NegativeTag,
  [gov2State.Timeout]: ClosedTag,
  [gov2State.Rejected]: NegativeTag,
  // [gov2State.Executed] see below,
};

// FIXME: gov2 state type field
export function Gov2ReferendaTag({ state, data }) {
  let Tag = gov2ReferendaTagMap[state] || ClosedTag;
  if (state === gov2State.Executed) {
    Tag = data.stateType === "success" ? PositiveTag : NegativeTag;
  }
  return <Tag>{state}</Tag>;
}
