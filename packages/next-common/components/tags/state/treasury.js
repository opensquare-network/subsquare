import React from "react";
import {
  ActiveTag,
  ClosedTag,
  NegativeTag,
  PositiveTag,
  StartTag,
} from "./styled";
import Tooltip from "next-common/components/tooltip";

const stateTagMap = {
  Proposed: StartTag,
  Awarded: PositiveTag,
  Approved: PositiveTag,
  Rejected: NegativeTag,
  ApproveVoting: PositiveTag,
  RejectVoting: NegativeTag,
};

const treasuryTooltipMap = {
  Proposed: "Submitted and waiting to enter voting",
  Awarded: "Proposal has been granted a reward",
  Approved: "Vote passed but action not yet executed",
  Rejected: "Vote failed and proposal not pass",
  ApproveVoting: "Voting process has started to approve the proposal",
  RejectVoting: "Voting process has started to reject the proposal",
};

const tipStateTagMap = {
  Tipping: StartTag,
  Retracted: NegativeTag,
  Closed: ClosedTag,
  Slashed: NegativeTag,

  "Report Awesome": StartTag,
  tipNew: StartTag,
  Tip: ActiveTag,
  "Tip Retracted": NegativeTag,
  "Tip Closed": ClosedTag,
};

const tipTooltipMap = {
  Tipping: "Tipping process is open for contributions",
  Retracted: "Tip proposal has been withdrawn",
  Closed: "Tipping process has ended",
  Slashed: "Funds have been penalized or removed due to misbehavior",

  "Report Awesome": "Proposal reported as worthy of a tip",
  tipNew: "A new tip suggestion has been submitted",
  Tip: "A proposal open for decision-making",
  "Tip Retracted": "Tip suggestion has been withdrawn",
  "Tip Closed": "Tipping process has ended",
  Removed: "Proposal has been removed from the process",
};

const bountyStateTagMap = {
  Proposed: StartTag,
  Approved: PositiveTag,
  Funded: ActiveTag,
  Active: ActiveTag,
  PendingPayout: ActiveTag,
  Rejected: NegativeTag,
  Canceled: NegativeTag,
  Claimed: PositiveTag,

  "Propose Bounty": StartTag,
  BountyBecameActive: ActiveTag,
  acceptCurator: PositiveTag,
  BountyExtended: ActiveTag,
  BountyAwarded: PositiveTag,
  BountyClaimed: PositiveTag,
  BountyRejected: NegativeTag,
  BountyApproved: PositiveTag,
  CuratorUnassigned: NegativeTag,
  CuratorProposed: StartTag,

  // in timeline
  CloseVoting: NegativeTag,
  ApproveVoting: PositiveTag,
  RejectVoting: NegativeTag,
};

const bountyTooltipMap = {
  Proposed: "Submitted and waiting to enter voting",
  Approved: "Vote passed but action not yet executed",
  Funded: "Proposal has been granted funding",
  Active: "Funding has been approved and is currently in use",
  PendingPayout: "Awaiting payout after approval",
  Rejected: "Vote failed and proposal not pass",
  Canceled: "Proposal was canceled before voting started",
  Claimed: "Funds have been claimed by the recipient",

  "Propose Bounty": "Bounty has been proposed and awaits approval",
  BountyBecameActive: "Bounty has been approved and is now active",
  acceptCurator: "Curator has accepted the responsibility",
  BountyExtended: "Bounty duration or scope has been extended",
  BountyAwarded: "Bounty has been granted to a contributor",
  BountyClaimed: "Bounty reward has been claimed",
  BountyRejected: "Bounty has been rejected",
  BountyApproved: "Bounty has been approved",
  CuratorUnassigned: "Curator role has been revoked or declined",
  CuratorProposed: "A curator candidate has been nominated",

  // in timeline
  CloseVoting: "Voting period has ended",
  ApproveVoting: "Voting process has started to approve the proposal",
  RejectVoting: "Voting process has started to reject the proposal",
};

const childBountyStateTagMap = {
  Added: StartTag,
  CuratorProposed: ActiveTag,
  Active: ActiveTag,
  PendingPayout: ActiveTag,
  Rejected: NegativeTag,
  Canceled: NegativeTag,
  Claimed: PositiveTag,

  // in timeline
  proposeCurator: ActiveTag,
  acceptCurator: ActiveTag,
  Awarded: PositiveTag,
};

const childBountyTooltipMap = {
  Added: "Child bounty has been added to the bounty",
  CuratorProposed: "A curator has been proposed for a child bounty",
  Active: "Child bounty has been approved and is now active",
  PendingPayout: "Awaiting payout after approval",
  Rejected: "Child Bounty has been rejected",
  Canceled: "Proposal was canceled before voting started",
  Claimed: "Child bounty reward has been claimed",

  // in timeline
  proposeCurator: "A curator candidate has been nominated",
  acceptCurator: "Curator has accepted the responsibility",
  Awarded: "Proposal has been granted a reward",
};

const spendStateTagMap = {
  Approved: StartTag,
  Paid: PositiveTag,
  Processed: PositiveTag,
  Voided: NegativeTag,
};

const spendTooltipMap = {
  Approved: "Vote passed but action not yet executed",
  Paid: "Funds have been disbursed",
  Processed: "Proposal or transaction has been fully processed",
  Voided: "Proposal or payment has been voided and invalidated",
};

export function TreasuryTag({ state }) {
  const Tag = stateTagMap[state] || ClosedTag;
  return (
    <Tooltip className="cursor-pointer" content={treasuryTooltipMap[state]}>
      <Tag>{state}</Tag>
    </Tooltip>
  );
}

export function TipTag({ state }) {
  let Tag = tipStateTagMap[state] || ClosedTag;
  if ((state || "").startsWith("Tipping")) {
    Tag = ActiveTag;
  }

  return (
    <Tooltip className="cursor-pointer" content={tipTooltipMap[state]}>
      <Tag>{state}</Tag>
    </Tooltip>
  );
}

export function BountyTag({ state }) {
  let Tag = bountyStateTagMap[state] || ClosedTag;
  return (
    <Tooltip className="cursor-pointer" content={bountyTooltipMap[state]}>
      <Tag>{state}</Tag>
    </Tooltip>
  );
}

export function ChildBountyTag({ state }) {
  let Tag = childBountyStateTagMap[state] || ClosedTag;
  return (
    <Tooltip className="cursor-pointer" content={childBountyTooltipMap[state]}>
      <Tag>{state}</Tag>
    </Tooltip>
  );
}

export function SpendTag({ state }) {
  let Tag = spendStateTagMap[state] || ClosedTag;
  return (
    <Tooltip className="cursor-pointer" content={spendTooltipMap[state]}>
      <Tag>{state}</Tag>
    </Tooltip>
  );
}
