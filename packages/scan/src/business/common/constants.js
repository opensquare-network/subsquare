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

module.exports = {
  Modules,
  TipEvents,
  TipMethods,
  ProxyMethods,
  MultisigMethods,
  UtilityMethods,
  TimelineItemTypes,
};
