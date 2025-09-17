export const ReferendaEventContents = {
  voted: "Voted",
  cancelled: "Cancelled",
  confirm_aborted: "ConfirmAborted",
  confirm_started: "ConfirmStarted",
  confirmed: "Confirmed",
  decision_deposit_placed: "DecisionDepositPlaced",
  decision_started: "DecisionStarted",
  killed: "Killed",
  executed: "Executed",
  rejected: "Rejected",
  submitted: "Submitted",
  timed_out: "TimedOut",
};

export const CoreEventContents = {
  params_changed: "ParamsChanged",
  active_changed: "ActiveChanged",
  inducted: "Inducted",
  offboarded: "Offboarded",
  imported: "Imported",
  promoted: "Promoted",
  demoted: "Demoted",
  proven: "Proven",
  requested: "Requested",
  evidence_judged: "EvidenceJudged",
};

export const SalaryEventContents = {
  cycle_started: "CycleStarted",
  inducted: "Inducted",
  registered: "Registered",
  paid: "Paid",
};

export const sectionMap = {
  membership: "fellowshipCore",
  salary: "fellowshipSalary",
  referenda: "fellowshipReferenda",
};

export const SECTION_EVENT_CONTENTS = {
  referenda: ReferendaEventContents,
  membership: CoreEventContents,
  salary: SalaryEventContents,
};
