export const fellowshipApplicationStates = {
  New: "new",
  Inducted: "inducted",
  Rejected: "rejected",
  Invalid: "invalid",
  TimedOut: "timedOut",
  Closed: "closed",
};

export const formattedViewMap = {
  [fellowshipApplicationStates.New]: "active",
  [fellowshipApplicationStates.Inducted]: "inducted",
  [fellowshipApplicationStates.Rejected]: "rejected",
  [fellowshipApplicationStates.Invalid]: "invalid",
  [fellowshipApplicationStates.TimedOut]: "timedOut",
  [fellowshipApplicationStates.Closed]: "closed",
};

export const finalStateActionTextMap = {
  [fellowshipApplicationStates.Rejected]: "Reject",
  [fellowshipApplicationStates.Invalid]: "Invalid",
  [fellowshipApplicationStates.TimedOut]: "Time Out",
  [fellowshipApplicationStates.Closed]: "Close",
};

export const terminateApplicationInfo = {
  [fellowshipApplicationStates.Rejected]: {
    title: "Reject Application",
    confirmText:
      "This will set this application as rejected, and the state can not be reversed.",
  },
  [fellowshipApplicationStates.Invalid]: {
    title: "Invalidate Application",
    confirmText:
      "This will set this application as invalid, and the state can not be reversed.",
  },
  [fellowshipApplicationStates.TimedOut]: {
    title: "Time Out Application",
    confirmText:
      "This will set this application as timedout, and the state can not be reversed.",
  },
  [fellowshipApplicationStates.Closed]: {
    title: "Close Application",
    confirmText:
      "This will set this application as closed, and the state can not be reversed.",
  },
};
