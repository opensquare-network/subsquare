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

const proposedTooltip = "Submitted and waiting to enter voting";
const canceledRoolrip = "Proposal was canceled";
const removedTooltip = "Proposal has been removed from the process";
const tabledTooltip = "Proposal has been scheduled for voting";
const fastTrackedTooltip = "Proposal has been marked for expedited processing";

const proposalTooltipMap = {
  Proposed: proposedTooltip,
  Tabled: tabledTooltip,
  Canceled: canceledRoolrip,
  Cleared: "Proposal has been cleared for the next step",
  ProposalCanceled: canceledRoolrip,
  Removed: removedTooltip,

  // In timeline
  FastTracked: fastTrackedTooltip,
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
  Proposed: proposedTooltip,
  Tabled: "Proposal has been scheduled for decision",
  Overwritten: "Proposal was replaced by a new submission",
  Vetoed: "Proposal was rejected by a veto authority",
  Removed: removedTooltip,

  // In timeline
  externalProposeMajority:
    "External proposal submitted, awaiting majority decision",
  ExternalTabled: "External proposal has been scheduled for decision",
  fastTrack: fastTrackedTooltip,
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
  Tabled: tabledTooltip,
  FastTrack: fastTrackedTooltip,

  Started: "Voting process has officially begun",
  Ongoing: "Process is active and awaiting next stage",
  Passed: "Vote passed successfully",
  NotPassed: "Vote failed to pass",
  Cancelled: "Proposal withdrawn before voting began",
  Executed: "Proposal passed and action taken",
  PreimageMissing: "Required preimage data is missing",
  PreimageInvalid: "Provided preimage data is invalid",

  Removed: removedTooltip,
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
