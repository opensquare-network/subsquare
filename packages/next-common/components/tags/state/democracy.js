import React from "react";
import { ClosedTag, NegativeTag, PositiveTag, StartTag } from "./styled";
import Tooltip from "next-common/components/tooltip";

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

const proposalTooltipMap = {
  Proposed: "Submitted and waiting to enter voting",
  Tabled: "Proposal has been scheduled for voting",
  Canceled: "Proposal was canceled before voting started",
  Cleared: "Proposal has been cleared for the next step",
  ProposalCanceled: "Proposal was canceled before voting started",
  Removed: "Proposal has been removed from the process",

  // In timeline
  FastTracked: "Proposal has been marked for expedited processing",
};

export function DemocracyProposalTag({ state }) {
  let Tag = proposalTagMap[state] || ClosedTag;
  if ((state || "").startsWith("Public proposal")) {
    Tag = StartTag;
  }

  return (
    <Tooltip content={proposalTooltipMap[state]}>
      <Tag>{state}</Tag>
    </Tooltip>
  );
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

const externalTooltipMap = {
  Proposed: "Submitted and waiting to enter voting",
  Tabled: "Proposal has been scheduled for decision",
  Overwritten: "Proposal was replaced by a new submission",
  Vetoed: "Proposal was rejected by a veto authority",
  Removed: "Proposal has been removed from the process",

  // In timeline
  externalProposeMajority:
    "External proposal submitted, awaiting majority decision",
  ExternalTabled: "External proposal has been scheduled for decision",
  fastTrack: "Proposal has been marked for expedited processing",
};

export function DemocracyExternalTag({ state }) {
  const Tag = externalTagMap[state] || ClosedTag;
  return (
    <Tooltip content={externalTooltipMap[state]}>
      <Tag>{state}</Tag>
    </Tooltip>
  );
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

const referendumTooltipMap = {
  Tabled: "Proposal has been scheduled for voting",
  FastTrack: "Proposal has been marked for expedited processing",

  Started: "Voting process has officially begun",
  Ongoing: "Process is active and awaiting next stage",
  Passed: "Vote passed successfully",
  NotPassed: "Vote failed to pass",
  Cancelled: "Proposal withdrawn before voting began",
  Executed: "Proposal passed and action taken",
  PreimageMissing: "Required preimage data is missing",
  PreimageInvalid: "Provided preimage data is invalid",

  Removed: "Proposal has been removed from the process",
};

export function DemocracyReferendumTag({ state, args }) {
  let Tag = referendumTagMap[state] || ClosedTag;
  if ("Executed" === state && args?.isOk === false) {
    Tag = NegativeTag;
  } else if ("Finished" === state) {
    Tag = args?.approved ? PositiveTag : NegativeTag;
  }

  return (
    <Tooltip content={referendumTooltipMap[state]}>
      <Tag>{state}</Tag>
    </Tooltip>
  );
}
