import React from "react";
import {
  ActiveTag,
  ClosedTag,
  NegativeTag,
  PositiveTag,
  StartTag,
} from "./styled";

const stateTagMap = {
  Proposed: StartTag,
  Awarded: PositiveTag,
  Rejected: NegativeTag,
  ApproveVoting: PositiveTag,
  RejectVoting: NegativeTag,
};

const tipStateTagMap = {
  Tipping: StartTag,
  Retracted: NegativeTag,
  Closed: ClosedTag,
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
};

const childBountyStateTagMap = {
  Added: StartTag,
  CuratorProposed: ActiveTag,
  Active: ActiveTag,
  PendingPayout: ActiveTag,
  Rejected: NegativeTag,
  Canceled: NegativeTag,
  Claimed: PositiveTag,
};

export function TreasuryTag({ state }) {
  const Tag = stateTagMap[state] || ClosedTag;
  return <Tag>{state}</Tag>;
}

export function TipTag({ state }) {
  let Tag = tipStateTagMap[state] || ClosedTag;
  if ((state || "").startsWith("Tipping")) {
    Tag = StartTag;
  }

  return <Tag>{state}</Tag>;
}

export function BountyTag({ state }) {
  let Tag = bountyStateTagMap[state] || ClosedTag;
  return <Tag>{state}</Tag>;
}

export function ChildBountyTag({ state }) {
  let Tag = childBountyStateTagMap[state] || ClosedTag;
  return <Tag>{state}</Tag>;
}
