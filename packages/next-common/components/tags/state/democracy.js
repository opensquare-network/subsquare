import React from "react";
import {
  ActiveTag,
  ClosedTag,
  NegativeTag,
  PositiveTag,
  StartTag,
} from "./styled";

const proposalTagMap = {
  Proposed: StartTag,
  Tabled: PositiveTag,
  Canceled: NegativeTag,
  Cleared: NegativeTag,
  ProposalCanceled: NegativeTag,
};

export function DemocracyProposalTag({ state }) {
  const Tag = proposalTagMap[state] || ClosedTag;
  return <Tag>{state}</Tag>;
}

const externalTagMap = {
  Proposed: StartTag,
  Tabled: PositiveTag,
  Overwritten: NegativeTag,
  Vetoed: NegativeTag,

  // In timeline
  externalProposeMajority: StartTag,
  ExternalTabled: PositiveTag,
};

export function DemocracyExternalTag({ state }) {
  const Tag = externalTagMap[state] || ClosedTag;
  return <Tag>{state}</Tag>;
}

const referendumTagMap = {
  Started: StartTag,
  Passed: PositiveTag,
  NotPassed: NegativeTag,
  Cancelled: NegativeTag,
  Executed: PositiveTag,
  PreimageMissing: NegativeTag,
  PreimageInvalid: NegativeTag,
};

export function DemocracyReferendumTag({ state }) {
  const Tag = referendumTagMap[state] || ClosedTag;
  return <Tag>{state}</Tag>;
}
