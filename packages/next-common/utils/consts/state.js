// TODO: may move other state/status into here

import { referendumState } from "./referendum";

export const gov2State = {
  Submitted: "Submitted",
  Queueing: "Queueing",
  Deciding: "Deciding",
  Confirming: "Confirming",
  Approved: "Approved",
  Cancelled: "Cancelled",
  Killed: "Killed",
  Timeout: "Timeout",
  TimedOut: "TimedOut",
  Rejected: "Rejected",
  Executed: "Executed",
};

export const gov2FinalState = [
  gov2State.Cancelled,
  gov2State.Approved,
  gov2State.Killed,
  gov2State.TimedOut,
  gov2State.Rejected,
];

export const democracyReferendumFinalState = [
  referendumState.Cancelled,
  referendumState.Executed,
  referendumState.NotPassed,
  referendumState.Passed,
  referendumState.PreimageInvalid,
  referendumState.PreimageMissing,
];
