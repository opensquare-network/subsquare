import React from "react";
import businessCategory, {
  detailPageCategory,
} from "../../../utils/consts/business/category";
import { TreasuryTag, TipTag, BountyTag, ChildBountyTag } from "./treasury";
import { ClosedTag } from "./styled";
import { CollectiveTag } from "./collective";
import {
  DemocracyExternalTag,
  DemocracyProposalTag,
  DemocracyReferendumTag,
} from "./democracy";

const categoryTagMap = {
  [businessCategory.treasuryProposals]: TreasuryTag,
  [detailPageCategory.TREASURY_PROPOSAL]: TreasuryTag,

  [businessCategory.treasuryTips]: TipTag,
  [detailPageCategory.TREASURY_TIP]: TipTag,

  [businessCategory.treasuryBounties]: BountyTag,
  [detailPageCategory.TREASURY_BOUNTY]: BountyTag,
  [businessCategory.treasuryChildBounties]: ChildBountyTag,
  [detailPageCategory.TREASURY_CHILD_BOUNTY]: ChildBountyTag,

  [businessCategory.councilMotions]: CollectiveTag,
  [detailPageCategory.COUNCIL_MOTION]: CollectiveTag,
  [businessCategory.tcProposals]: CollectiveTag,
  [detailPageCategory.TECH_COMM_MOTION]: CollectiveTag,

  [businessCategory.democracyProposals]: DemocracyProposalTag,
  [detailPageCategory.DEMOCRACY_PROPOSAL]: DemocracyProposalTag,

  [businessCategory.democracyExternals]: DemocracyExternalTag,
  [detailPageCategory.DEMOCRACY_EXTERNAL]: DemocracyExternalTag,

  [businessCategory.democracyReferenda]: DemocracyReferendumTag,
  [detailPageCategory.DEMOCRACY_REFERENDUM]: DemocracyReferendumTag,
};

export default function Tag({ category, state }) {
  const Tag = categoryTagMap[category];
  if (Tag) {
    return <Tag state={state} />;
  }

  return <ClosedTag>{state}</ClosedTag>;
}
