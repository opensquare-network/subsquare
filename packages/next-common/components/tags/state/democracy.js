import React from "react";
import { ClosedTag, NegativeTag, PositiveTag, StartTag } from "./styled";

const proposalTagMap = {
  Proposed: StartTag,
  Tabled: PositiveTag,
  Canceled: NegativeTag,
  Cleared: NegativeTag,
  ProposalCanceled: NegativeTag,
  Removed: ClosedTag,

  // In timeline
  FastTracked: PositiveTag,
};

export function DemocracyProposalTag({ state }) {
  let Tag = proposalTagMap[state] || ClosedTag;
  if ((state || "").startsWith("Public proposal")) {
    Tag = StartTag;
  }

  return <Tag>{state}</Tag>;
}

const externalTagMap = {
  Proposed: StartTag,
  Tabled: PositiveTag,
  Overwritten: NegativeTag,
  Vetoed: NegativeTag,
  Removed: ClosedTag,

  // In timeline
  externalProposeMajority: StartTag,
  ExternalTabled: PositiveTag,
  fastTrack: PositiveTag,
};

export function DemocracyExternalTag({ state }) {
  const Tag = externalTagMap[state] || ClosedTag;
  return <Tag>{state}</Tag>;
}

const referendumTagMap = {
  Tabled: PositiveTag,
  FastTrack: PositiveTag,

  Started: StartTag,
  Ongoing: StartTag,
  Passed: PositiveTag,
  NotPassed: NegativeTag,
  Cancelled: NegativeTag,
  Executed: PositiveTag,
  PreimageMissing: NegativeTag,
  PreimageInvalid: NegativeTag,

  Removed: ClosedTag,
};

export function DemocracyReferendumTag({ state, args }) {
  let Tag = referendumTagMap[state] || ClosedTag;
  if ("Executed" === state && args?.isOk === false) {
    Tag = NegativeTag;
  } else if ("Finished" === state) {
    Tag = args?.approved ? PositiveTag : NegativeTag;
  }

  return <Tag>{state}</Tag>;
}
