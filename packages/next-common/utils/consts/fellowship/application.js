export const finalStateMap = {
  New: "new",
  Inducted: "inducted",
  Rejected: "rejected",
  Invalid: "invalid",
  Timeout: "timedOut",
};

export const formattedViewMap = {
  [finalStateMap.New]: "applying",
  [finalStateMap.Inducted]: "inducted",
  [finalStateMap.Rejected]: "rejected",
  [finalStateMap.Invalid]: "invalid",
  [finalStateMap.Timeout]: "timedOut",
};

export const finalStateActionTextMap = {
  [finalStateMap.Rejected]: "Reject",
  [finalStateMap.Invalid]: "Invalid",
  [finalStateMap.Timeout]: "Time Out",
};

export const terminateApplicationInfo = {
  [finalStateMap.Rejected]: {
    title: "Reject Application",
    confirmText:
      "This will set this application as rejected, and the state can not be reversed.",
  },
  [finalStateMap.Invalid]: {
    title: "Invalidate Application",
    confirmText:
      "This will set this application as invalid, and the state can not be reversed.",
  },
  [finalStateMap.Timeout]: {
    title: "Time Out Application",
    confirmText:
      "This will set this application as timedout, and the state can not be reversed.",
  },
};
