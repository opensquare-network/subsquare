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
