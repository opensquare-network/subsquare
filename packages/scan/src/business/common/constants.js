const Modules = Object.freeze({
  Treasury: "treasury",
  Council: "council",
  Proxy: "proxy",
  Multisig: "multisig",
  Utility: "utility",
  Tips: "tips",
  Bounties: "bounties",
  Staking: "staking",
  Identity: "identity",
  Democracy: "democracy",
  ElectionsPhragmen: "electionsPhragmen",
  PhragmenElection: "PhragmenElection",
  Session: "session",
  Balances: "balances",
  Sudo: "sudo",
});

const KaruraModules = Object.freeze({
  GeneralCouncil: "generalCouncil",
});

const TipEvents = Object.freeze({
  NewTip: "NewTip",
  TipClosing: "TipClosing",
  TipClosed: "TipClosed",
  TipRetracted: "TipRetracted",
  TipSlashed: "TipSlashed",
});

const TipMethods = Object.freeze({
  tipNew: "tipNew",
  reportAwesome: "reportAwesome",
  retractTip: "retractTip",
  tip: "tip",
  closeTip: "closeTip",
});

const ProxyMethods = Object.freeze({
  proxy: "proxy",
});

const MultisigMethods = Object.freeze({
  asMulti: "asMulti",
});

const UtilityMethods = Object.freeze({
  batch: "batch",
});

const TimelineItemTypes = Object.freeze({
  extrinsic: "extrinsic",
  event: "event",
});

const CouncilEvents = Object.freeze({
  Proposed: "Proposed",
  Voted: "Voted",
  Approved: "Approved",
  Disapproved: "Disapproved",
  Executed: "Executed",
  Closed: "Closed",
});

const TreasuryProposalEvents = Object.freeze({
  Proposed: "Proposed",
  Awarded: "Awarded",
  Rejected: "Rejected",
});

const TreasuryProposalMethods = Object.freeze({
  proposeSpend: "proposeSpend",
  rejectProposal: "rejectProposal",
  approveProposal: "approveProposal",
});

const MotionState = Object.freeze({
  ApproveVoting: "ApproveVoting",
  RejectVoting: "RejectVoting",
});

const DemocracyPublicProposalEvents = Object.freeze({
  Proposed: "Proposed",
  Tabled: "Tabled",
  Started: "Started",
});

const ReferendumEvents = Object.freeze({
  Started: "Started",
  Passed: "Passed",
  NotPassed: "NotPassed",
  Cancelled: "Cancelled",
  Executed: "Executed",
});

module.exports = {
  Modules,
  TipEvents,
  TipMethods,
  ProxyMethods,
  MultisigMethods,
  UtilityMethods,
  TimelineItemTypes,
  CouncilEvents,
  KaruraModules,
  TreasuryProposalEvents,
  TreasuryProposalMethods,
  MotionState,
  DemocracyPublicProposalEvents,
  ReferendumEvents,
};
