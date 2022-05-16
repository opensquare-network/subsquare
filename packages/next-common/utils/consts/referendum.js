export const referendumState = Object.freeze({
  Executed: "Executed",
  Cancelled: "Cancelled",
  NotPassed: "NotPassed",
  Passed: "Passed",
  Started: "Started",
  PreimageMissing: "PreimageMissing",
  PreimageInvalid: "PreimageInvalid",
});

export const votingThreshold = Object.freeze({
  SimpleMajority: "simplemajority",
  SuperMajorityAgainst: "supermajorityagainst",
  SuperMajorityApprove: "supermajorityapprove",
});
