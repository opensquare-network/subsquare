import React from "react";
import businessCategory, {
  detailPageCategory,
} from "../../../utils/consts/business/category";
import {
  TreasuryTag,
  TipTag,
  BountyTag,
  ChildBountyTag,
  SpendTag,
} from "./treasury";
import { ClosedTag, MotionTag } from "./styled";
import { CollectiveTag } from "./collective";
import {
  DemocracyExternalTag,
  DemocracyProposalTag,
  DemocracyReferendumTag,
} from "./democracy";
import { Gov2ReferendaTag } from "./gov2";
import AnnouncementTag from "./announcement";

const categoryTagMap = {
  [businessCategory.treasuryProposals]: TreasuryTag,
  [detailPageCategory.TREASURY_PROPOSAL]: TreasuryTag,

  [businessCategory.communityTreasuryProposals]: TreasuryTag,
  [detailPageCategory.COMMUNITY_TREASURY_PROPOSAL]: TreasuryTag,

  [businessCategory.treasuryTips]: TipTag,
  [detailPageCategory.TREASURY_TIP]: TipTag,

  [businessCategory.treasuryBounties]: BountyTag,
  [detailPageCategory.TREASURY_BOUNTY]: BountyTag,

  [businessCategory.treasuryChildBounties]: ChildBountyTag,
  [detailPageCategory.TREASURY_CHILD_BOUNTY]: ChildBountyTag,

  [businessCategory.councilMotions]: CollectiveTag,
  [detailPageCategory.COUNCIL_MOTION]: CollectiveTag,

  [businessCategory.communityMotions]: CollectiveTag,
  [detailPageCategory.COMMUNITY_MOTION]: CollectiveTag,

  [businessCategory.tcProposals]: CollectiveTag,
  [detailPageCategory.TECH_COMM_MOTION]: CollectiveTag,

  [businessCategory.advisoryMotions]: CollectiveTag,
  [detailPageCategory.ADVISORY_MOTION]: CollectiveTag,

  [businessCategory.allianceMotions]: CollectiveTag,
  [detailPageCategory.ALLIANCE_MOTION]: CollectiveTag,

  [businessCategory.financialMotions]: CollectiveTag,
  [detailPageCategory.FINANCIAL_MOTION]: CollectiveTag,

  [businessCategory.treasuryCouncilMotions]: CollectiveTag,
  [detailPageCategory.TREASURY_COUNCIL_MOTION]: CollectiveTag,

  [businessCategory.openTechCommitteeProposals]: CollectiveTag,
  [detailPageCategory.OPEN_TECH_COMM_PROPOSAL]: CollectiveTag,

  [businessCategory.collective]: CollectiveTag,

  [businessCategory.democracyProposals]: DemocracyProposalTag,
  [detailPageCategory.DEMOCRACY_PROPOSAL]: DemocracyProposalTag,

  [businessCategory.democracyExternals]: DemocracyExternalTag,
  [detailPageCategory.DEMOCRACY_EXTERNAL]: DemocracyExternalTag,

  [businessCategory.democracyReferenda]: DemocracyReferendumTag,
  [detailPageCategory.DEMOCRACY_REFERENDUM]: DemocracyReferendumTag,

  [businessCategory.openGovReferenda]: Gov2ReferendaTag,
  [detailPageCategory.GOV2_REFERENDUM]: Gov2ReferendaTag,

  [businessCategory.fellowship]: Gov2ReferendaTag,
  [detailPageCategory.FELLOWSHIP_REFERENDUM]: Gov2ReferendaTag,

  [businessCategory.allianceAnnouncements]: AnnouncementTag,
  [detailPageCategory.ALLIANCE_ANNOUNCEMENT]: AnnouncementTag,

  [businessCategory.treasurySpends]: SpendTag,
  [detailPageCategory.TREASURY_SPEND]: SpendTag,
};

export default function Tag({ category, state, link, args }) {
  let element = state;
  if (link) {
    element = <a href={link}>{state}</a>;
    return <MotionTag>{element}</MotionTag>;
  }

  const Tag = categoryTagMap[category];
  if (Tag) {
    return <Tag state={element} args={args} />;
  }
  return <ClosedTag>{element}</ClosedTag>;
}
