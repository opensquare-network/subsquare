export const finalStateMap = {
  New: "new",
  Inducted: "inducted",
  Rejected: "rejected",
  Invalid: "invalid",
  Timeout: "timedOut",
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
      "This will reject the application, and you will not be able to reverse this decision.",
  },
  [finalStateMap.Invalid]: {
    title: "Invalidate Application",
    confirmText:
      "This will invalidate the application. You will not be able to restore it.",
  },
  [finalStateMap.Timeout]: {
    title: "Time Out Application",
    confirmText:
      "This will time out the application. You will not be able to reopen it.",
  },
};
