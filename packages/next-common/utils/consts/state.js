// TODO: may move other state/status into here

export const gov2State = {
  Submitted: "Submitted",
  Preparing: "Preparing",
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

export const gov2VotingStates = [
  gov2State.Preparing,
  gov2State.Submitted,
  gov2State.Queueing,
  gov2State.Deciding,
  gov2State.Confirming,
];
