const DemocracyEvents = Object.freeze({
  Proposed: "Proposed",
  Tabled: "Tabled",
  FastTrack: "FastTrack", // only kintsugi
  Started: "Started",
  Passed: "Passed",
  Executed: "Executed",
});

const publicProposalState = Object.freeze({
  FastTracked: "FastTracked",
});

module.exports = {
  DemocracyEvents,
  publicProposalState,
};
