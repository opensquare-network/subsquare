import TreasuryProposalProposedContent from "./treasuryProposalProposedContent";
import TreasuryTipContent from "./treasuryTipContent";
import DemocracyReferendumContent from "./democracyReferendumContent";
import ReferendaReferendumContent from "./referendaReferendumContent";
import FellowshipReferendumContent from "./fellowshipReferendumContent";
import TreasuryChildBountyAddedContent from "./treasuryChildBountyAddedContent";
import TreasuryChildBountyAwardedContent from "./treasuryChildBountyAwardedContent";
import TreasuryChildBountyCanceledContent from "./treasuryChildBountyCanceledContent";
import TreasuryChildBountyClaimedContent from "./treasuryChildBountyClaimedContent";
import TreasuryProposalAwardedContent from "./treasuryProposalAwardedContent";
import DemocracyProposalProposedContent from "./democracyProposalProposedContent";
import DemocracyProposalCanceledContent from "./democracyProposalCanceledContent";
import DemocracyReferendumStartedContent from "./democracyReferendumStartedContent";
import DemocracyReferendumPassedOrNotPassedContent from "./democracyReferendumPassedOrNotPassedContent";
import TreasuryBountyProposedContent from "./treasuryBountyProposedContent";
import TreasuryBountyRejectedContent from "./treasuryBountyRejectedContent";
import TreasuryBountyCanceledContent from "./treasuryBountyCanceledContent";
import TreasuryBountyClaimedContent from "./treasuryBountyClaimedContent";
import TreasuryBountyAwardedContent from "./treasuryBountyAwardedContent";
import treasuryProposalApprovedContent from "./treasuryProposalApprovedContent";
import TreasuryProposalRejectedContent from "./treasuryProposalRejectedContent";
import DemocracyReferendumExecutedContent from "./democracyReferendumExecutedContent";
import DemocracyReferendumNotExecutedContent from "./democracyReferendumNoExecutedContent";
import CouncilMotionContent from "./councilMotionContent";
import TechCommMotionContent from "./techCommMotionContent";
import AdvisoryCommitteeContent from "./advisoryCommitteeContent";
import {
  advisoryCommitteeBaseUrl,
  bountyBaseUrl,
  childBountyBaseUrl,
  councilMotionBaseUrl,
  democracyProposalBaseUrl,
  democracyReferendumBaseUrl,
  fellowshipReferendumBaseUrl,
  referendaReferendumBaseUrl,
  techCommMotionBaseUrl,
  tipBaseUrl,
  treasuryProposalBaseUrl,
} from "../../../../utils/postBaseUrl";

export const EventType = {
  // Treasury proposal
  TreasuryProposalProposed: "treasury_proposal_proposed",
  TreasuryProposalApproved: "treasury_proposal_approved",
  TreasuryProposalAwarded: "treasury_proposal_awarded",
  TreasuryProposalRejected: "treasury_proposal_rejected",

  // Council motion
  CouncilMotionProposed: "council_motion_proposed",
  CouncilMotionApproved: "council_motion_approved",
  CouncilMotionDisApproved: "council_motion_dis_approved",

  // Treasury tip
  TreasuryTipNew: "treasury_tip_new",
  TreasuryTipClosed: "treasury_tip_closed",
  TreasuryTipRetracted: "treasury_tip_retracted",

  // Treasury bounties
  TreasuryBountyProposed: "treasury_bounty_proposed",
  TreasuryBountyAwarded: "treasury_bounty_awarded",
  TreasuryBountyClaimed: "treasury_bounty_claimed",
  TreasuryBountyRejected: "treasury_bounty_rejected",
  TreasuryBountyApproved: "treasury_bounty_approved",
  TreasuryBountyCanceled: "treasury_bounty_canceled",

  // Treasury child bounties
  TreasuryChildBountyAdded: "treasury_child_bounty_added",
  TreasuryChildBountyAwarded: "treasury_child_bounty_awarded",
  TreasuryChildBountyCanceled: "treasury_child_bounty_canceled",
  TreasuryChildBountyClaimed: "treasury_child_bounty_claimed",

  // Tech-comm. motion
  TcMotionProposed: "tc_motion_proposed",
  TcMotionApproved: "tc_motion_approved",
  TcMotionDisApproved: "tc_motion_dis_approved",
  TcMotionExecuted: "tc_motion_executed", // for kintsugi/interlay only

  // Democracy public proposal
  DemocracyProposalProposed: "democracy_proposal_proposed",
  DemocracyProposalCanceled: "democracy_proposal_canceled",

  // Democracy referendum
  DemocracyReferendumStarted: "democracy_referendum_started",
  DemocracyReferendumPassed: "democracy_referendum_passed",
  DemocracyReferendumNotPassed: "democracy_referendum_not_passed",
  DemocracyReferendumCancelled: "democracy_referendum_cancelled",
  DemocracyReferendumExecuted: "democracy_referendum_executed",
  DemocracyReferendumNotExecuted: "democracy_referendum_not_executed", // can not be executed due to error: PreimageMissing/PreimageInvalid
  DemocracyReferendumFastTrack: "democracy_referendum_fast_track", // for kintsugi/interlay only, they will fast track referendum

  // Gov2 Referendum
  ReferendaSubmitted: "referenda_submitted",
  ReferendaDecisionStarted: "referenda_decision_started",
  ReferendaConfirmStarted: "referenda_confirm_started",
  ReferendaConfirmAborted: "referenda_confirm_aborted",
  ReferendaConfirmed: "referenda_confirmed",
  ReferendaCancelled: "referenda_cancelled",
  ReferendaKilled: "referenda_killed",
  ReferendaTimedout: "referenda_timedout",
  ReferendaRejected: "referenda_rejected",
  ReferendaExecuted: "referenda_executed",

  // Fellowship
  FellowshipSubmitted: "fellowship_submitted",
  FellowshipDecisionStarted: "fellowship_decision_started",
  FellowshipConfirmStarted: "fellowship_confirm_started",
  FellowshipConfirmAborted: "fellowship_confirm_aborted",
  FellowshipConfirmed: "fellowship_confirmed",
  FellowshipCancelled: "fellowship_cancelled",
  FellowshipKilled: "fellowship_killed",
  FellowshipTimedout: "fellowship_timedout",
  FellowshipRejected: "fellowship_rejected",
  FellowshipExecuted: "fellowship_executed",

  // Zeitgeist advisory
  AdvisoryCommitteeProposed: "advisory_committee_proposed",
  AdvisoryCommitteeApproved: "advisory_committee_approved",
  AdvisoryCommitteeDisApproved: "advisory_committee_dis_approved",
};

export const EventTypeToComponent = {
  [EventType.TreasuryProposalProposed]: TreasuryProposalProposedContent,
  [EventType.TreasuryProposalApproved]: treasuryProposalApprovedContent,
  [EventType.TreasuryProposalAwarded]: TreasuryProposalAwardedContent,
  [EventType.TreasuryProposalRejected]: TreasuryProposalRejectedContent,

  [EventType.TreasuryTipNew]: TreasuryTipContent,
  [EventType.TreasuryTipClosed]: TreasuryTipContent,
  [EventType.TreasuryTipRetracted]: TreasuryTipContent,

  [EventType.TreasuryBountyProposed]: TreasuryBountyProposedContent,
  [EventType.TreasuryBountyAwarded]: TreasuryBountyAwardedContent,
  [EventType.TreasuryBountyClaimed]: TreasuryBountyClaimedContent,
  [EventType.TreasuryBountyRejected]: TreasuryBountyRejectedContent,
  [EventType.TreasuryBountyApproved]: TreasuryBountyProposedContent,
  [EventType.TreasuryBountyCanceled]: TreasuryBountyCanceledContent,

  [EventType.TreasuryChildBountyAdded]: TreasuryChildBountyAddedContent,
  [EventType.TreasuryChildBountyAwarded]: TreasuryChildBountyAwardedContent,
  [EventType.TreasuryChildBountyCanceled]: TreasuryChildBountyCanceledContent,
  [EventType.TreasuryChildBountyClaimed]: TreasuryChildBountyClaimedContent,

  [EventType.CouncilMotionProposed]: CouncilMotionContent,
  [EventType.CouncilMotionApproved]: CouncilMotionContent,
  [EventType.CouncilMotionDisApproved]: CouncilMotionContent,

  [EventType.TcMotionProposed]: TechCommMotionContent,
  [EventType.TcMotionApproved]: TechCommMotionContent,
  [EventType.TcMotionDisApproved]: TechCommMotionContent,
  [EventType.TcMotionExecuted]: TechCommMotionContent,

  [EventType.AdvisoryCommitteeProposed]: AdvisoryCommitteeContent,
  [EventType.AdvisoryCommitteeApproved]: AdvisoryCommitteeContent,
  [EventType.AdvisoryCommitteeDisApproved]: AdvisoryCommitteeContent,

  [EventType.DemocracyProposalProposed]: DemocracyProposalProposedContent,
  [EventType.DemocracyProposalCanceled]: DemocracyProposalCanceledContent,

  [EventType.DemocracyReferendumStarted]: DemocracyReferendumStartedContent,
  [EventType.DemocracyReferendumPassed]:
    DemocracyReferendumPassedOrNotPassedContent,
  [EventType.DemocracyReferendumNotPassed]:
    DemocracyReferendumPassedOrNotPassedContent,
  [EventType.DemocracyReferendumCancelled]: DemocracyReferendumContent,
  [EventType.DemocracyReferendumExecuted]: DemocracyReferendumExecutedContent,
  [EventType.DemocracyReferendumNotExecuted]:
    DemocracyReferendumNotExecutedContent,
  [EventType.DemocracyReferendumFastTrack]: DemocracyReferendumContent,

  [EventType.ReferendaSubmitted]: ReferendaReferendumContent,
  [EventType.ReferendaDecisionStarted]: ReferendaReferendumContent,
  [EventType.ReferendaConfirmStarted]: ReferendaReferendumContent,
  [EventType.ReferendaConfirmAborted]: ReferendaReferendumContent,
  [EventType.ReferendaConfirmed]: ReferendaReferendumContent,
  [EventType.ReferendaCancelled]: ReferendaReferendumContent,
  [EventType.ReferendaKilled]: ReferendaReferendumContent,
  [EventType.ReferendaTimedout]: ReferendaReferendumContent,
  [EventType.ReferendaRejected]: ReferendaReferendumContent,
  [EventType.ReferendaExecuted]: ReferendaReferendumContent,

  [EventType.FellowshipSubmitted]: FellowshipReferendumContent,
  [EventType.FellowshipDecisionStarted]: FellowshipReferendumContent,
  [EventType.FellowshipConfirmStarted]: FellowshipReferendumContent,
  [EventType.FellowshipConfirmAborted]: FellowshipReferendumContent,
  [EventType.FellowshipConfirmed]: FellowshipReferendumContent,
  [EventType.FellowshipCancelled]: FellowshipReferendumContent,
  [EventType.FellowshipKilled]: FellowshipReferendumContent,
  [EventType.FellowshipTimedout]: FellowshipReferendumContent,
  [EventType.FellowshipRejected]: FellowshipReferendumContent,
  [EventType.FellowshipExecuted]: FellowshipReferendumContent,
};

export const EventTypePostBaseUrl = {
  [EventType.TreasuryProposalProposed]: treasuryProposalBaseUrl,
  [EventType.TreasuryProposalApproved]: treasuryProposalBaseUrl,
  [EventType.TreasuryProposalAwarded]: treasuryProposalBaseUrl,
  [EventType.TreasuryProposalRejected]: treasuryProposalBaseUrl,

  [EventType.TreasuryTipNew]: tipBaseUrl,
  [EventType.TreasuryTipClosed]: tipBaseUrl,
  [EventType.TreasuryTipRetracted]: tipBaseUrl,

  [EventType.TreasuryBountyProposed]: bountyBaseUrl,
  [EventType.TreasuryBountyAwarded]: bountyBaseUrl,
  [EventType.TreasuryBountyClaimed]: bountyBaseUrl,
  [EventType.TreasuryBountyRejected]: bountyBaseUrl,
  [EventType.TreasuryBountyApproved]: bountyBaseUrl,
  [EventType.TreasuryBountyCanceled]: bountyBaseUrl,

  [EventType.TreasuryChildBountyAdded]: childBountyBaseUrl,
  [EventType.TreasuryChildBountyAwarded]: childBountyBaseUrl,
  [EventType.TreasuryChildBountyCanceled]: childBountyBaseUrl,
  [EventType.TreasuryChildBountyClaimed]: childBountyBaseUrl,

  [EventType.CouncilMotionProposed]: councilMotionBaseUrl,
  [EventType.CouncilMotionApproved]: councilMotionBaseUrl,
  [EventType.CouncilMotionDisApproved]: councilMotionBaseUrl,

  [EventType.TcMotionProposed]: techCommMotionBaseUrl,
  [EventType.TcMotionApproved]: techCommMotionBaseUrl,
  [EventType.TcMotionDisApproved]: techCommMotionBaseUrl,
  [EventType.TcMotionExecuted]: techCommMotionBaseUrl,

  [EventType.AdvisoryCommitteeProposed]: advisoryCommitteeBaseUrl,
  [EventType.AdvisoryCommitteeApproved]: advisoryCommitteeBaseUrl,
  [EventType.AdvisoryCommitteeDisApproved]: advisoryCommitteeBaseUrl,

  [EventType.DemocracyProposalProposed]: democracyProposalBaseUrl,
  [EventType.DemocracyProposalCanceled]: democracyProposalBaseUrl,

  [EventType.DemocracyReferendumStarted]: democracyReferendumBaseUrl,
  [EventType.DemocracyReferendumPassed]: democracyReferendumBaseUrl,
  [EventType.DemocracyReferendumNotPassed]: democracyReferendumBaseUrl,
  [EventType.DemocracyReferendumCancelled]: democracyReferendumBaseUrl,
  [EventType.DemocracyReferendumExecuted]: democracyReferendumBaseUrl,
  [EventType.DemocracyReferendumNotExecuted]: democracyReferendumBaseUrl,
  [EventType.DemocracyReferendumFastTrack]: democracyReferendumBaseUrl,

  [EventType.ReferendaSubmitted]: referendaReferendumBaseUrl,
  [EventType.ReferendaDecisionStarted]: referendaReferendumBaseUrl,
  [EventType.ReferendaConfirmStarted]: referendaReferendumBaseUrl,
  [EventType.ReferendaConfirmAborted]: referendaReferendumBaseUrl,
  [EventType.ReferendaConfirmed]: referendaReferendumBaseUrl,
  [EventType.ReferendaCancelled]: referendaReferendumBaseUrl,
  [EventType.ReferendaKilled]: referendaReferendumBaseUrl,
  [EventType.ReferendaTimedout]: referendaReferendumBaseUrl,
  [EventType.ReferendaRejected]: referendaReferendumBaseUrl,
  [EventType.ReferendaExecuted]: referendaReferendumBaseUrl,

  [EventType.FellowshipSubmitted]: fellowshipReferendumBaseUrl,
  [EventType.FellowshipDecisionStarted]: fellowshipReferendumBaseUrl,
  [EventType.FellowshipConfirmStarted]: fellowshipReferendumBaseUrl,
  [EventType.FellowshipConfirmAborted]: fellowshipReferendumBaseUrl,
  [EventType.FellowshipConfirmed]: fellowshipReferendumBaseUrl,
  [EventType.FellowshipCancelled]: fellowshipReferendumBaseUrl,
  [EventType.FellowshipKilled]: fellowshipReferendumBaseUrl,
  [EventType.FellowshipTimedout]: fellowshipReferendumBaseUrl,
  [EventType.FellowshipRejected]: fellowshipReferendumBaseUrl,
  [EventType.FellowshipExecuted]: fellowshipReferendumBaseUrl,
};

export function getPostUrlsByEvent(event = {}) {
  const treasuryProposalPostUrl =
    treasuryProposalBaseUrl + `/${event?.proposalIndex}`;
  const tipPostUrl = tipBaseUrl+`/${event?.indexer?.blockHeight}_${event?.hash}`;
  const bountyPostUrl = bountyBaseUrl + `/${event?.bountyIndex}`;
  const childBountyPostUrl = childBountyBaseUrl + `/${event?.childBountyIndex}`;
  const motionTargetUrl = event?.data?.motion?.index || event?.motionHash;
  const councilMotionPostUrl = councilMotionBaseUrl + `/${motionTargetUrl}`;
  const techCommMotionPostUrl = techCommMotionBaseUrl + `/${motionTargetUrl}`;
  const advisoryCommitteePostUrl =
    advisoryCommitteeBaseUrl + `/${motionTargetUrl}`;
  const democracyProposalPostUrl =
    democracyProposalBaseUrl + `/${event?.proposalIndex}`;
  const democracyReferendumPostUrl =
    democracyReferendumBaseUrl + `/${event?.referendumIndex}`;
  const referendaReferendumPostUrl =
    referendaReferendumBaseUrl + `/${event?.index}`;
  const fellowshipReferendumPostUrl =
    fellowshipReferendumBaseUrl + `/${event?.index}`;

  return {
    [EventType.TreasuryProposalProposed]: treasuryProposalPostUrl,
    [EventType.TreasuryProposalApproved]: treasuryProposalPostUrl,
    [EventType.TreasuryProposalAwarded]: treasuryProposalPostUrl,
    [EventType.TreasuryProposalRejected]: treasuryProposalPostUrl,

    [EventType.TreasuryTipNew]: tipPostUrl,
    [EventType.TreasuryTipClosed]: tipPostUrl,
    [EventType.TreasuryTipRetracted]: tipPostUrl,

    [EventType.TreasuryBountyProposed]: bountyPostUrl,
    [EventType.TreasuryBountyAwarded]: bountyPostUrl,
    [EventType.TreasuryBountyClaimed]: bountyPostUrl,
    [EventType.TreasuryBountyRejected]: bountyPostUrl,
    [EventType.TreasuryBountyApproved]: bountyPostUrl,
    [EventType.TreasuryBountyCanceled]: bountyPostUrl,

    [EventType.TreasuryChildBountyAdded]: childBountyPostUrl,
    [EventType.TreasuryChildBountyAwarded]: childBountyPostUrl,
    [EventType.TreasuryChildBountyCanceled]: childBountyPostUrl,
    [EventType.TreasuryChildBountyClaimed]: childBountyPostUrl,

    [EventType.CouncilMotionProposed]: councilMotionPostUrl,
    [EventType.CouncilMotionApproved]: councilMotionPostUrl,
    [EventType.CouncilMotionDisApproved]: councilMotionPostUrl,

    [EventType.TcMotionProposed]: techCommMotionPostUrl,
    [EventType.TcMotionApproved]: techCommMotionPostUrl,
    [EventType.TcMotionDisApproved]: techCommMotionPostUrl,
    [EventType.TcMotionExecuted]: techCommMotionPostUrl,

    [EventType.AdvisoryCommitteeProposed]: advisoryCommitteePostUrl,
    [EventType.AdvisoryCommitteeApproved]: advisoryCommitteePostUrl,
    [EventType.AdvisoryCommitteeDisApproved]: advisoryCommitteePostUrl,

    [EventType.DemocracyProposalProposed]: democracyProposalPostUrl,
    [EventType.DemocracyProposalCanceled]: democracyProposalPostUrl,

    [EventType.DemocracyReferendumStarted]: democracyReferendumPostUrl,
    [EventType.DemocracyReferendumPassed]: democracyReferendumPostUrl,
    [EventType.DemocracyReferendumNotPassed]: democracyReferendumPostUrl,
    [EventType.DemocracyReferendumCancelled]: democracyReferendumPostUrl,
    [EventType.DemocracyReferendumExecuted]: democracyReferendumPostUrl,
    [EventType.DemocracyReferendumNotExecuted]: democracyReferendumPostUrl,
    [EventType.DemocracyReferendumFastTrack]: democracyReferendumPostUrl,

    [EventType.ReferendaSubmitted]: referendaReferendumPostUrl,
    [EventType.ReferendaDecisionStarted]: referendaReferendumPostUrl,
    [EventType.ReferendaConfirmStarted]: referendaReferendumPostUrl,
    [EventType.ReferendaConfirmAborted]: referendaReferendumPostUrl,
    [EventType.ReferendaConfirmed]: referendaReferendumPostUrl,
    [EventType.ReferendaCancelled]: referendaReferendumPostUrl,
    [EventType.ReferendaKilled]: referendaReferendumPostUrl,
    [EventType.ReferendaTimedout]: referendaReferendumPostUrl,
    [EventType.ReferendaRejected]: referendaReferendumPostUrl,
    [EventType.ReferendaExecuted]: referendaReferendumPostUrl,

    [EventType.FellowshipSubmitted]: fellowshipReferendumPostUrl,
    [EventType.FellowshipDecisionStarted]: fellowshipReferendumPostUrl,
    [EventType.FellowshipConfirmStarted]: fellowshipReferendumPostUrl,
    [EventType.FellowshipConfirmAborted]: fellowshipReferendumPostUrl,
    [EventType.FellowshipConfirmed]: fellowshipReferendumPostUrl,
    [EventType.FellowshipCancelled]: fellowshipReferendumPostUrl,
    [EventType.FellowshipKilled]: fellowshipReferendumPostUrl,
    [EventType.FellowshipTimedout]: fellowshipReferendumPostUrl,
    [EventType.FellowshipRejected]: fellowshipReferendumPostUrl,
    [EventType.FellowshipExecuted]: fellowshipReferendumPostUrl,
  };
}
