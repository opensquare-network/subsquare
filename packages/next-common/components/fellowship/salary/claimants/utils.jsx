const CLAIM_STATS = {
  Registered: "Registered",
  Nothing: "Nothing",
  Attempted: "Attempted",
};

export const claimStatsValues = Object.values(CLAIM_STATS);

export function toClaimStatusLabel(status) {
  return status === CLAIM_STATS.Attempted ? "Paid" : status;
}

export const claimantListColumns = [
  {
    name: "Rank",
    width: 80,
  },
  {
    name: "Claimant",
    className: "min-w-[200px]",
  },
  {
    name: "Active Salary",
    className: "text-right",
    width: 160,
  },
  {
    name: "Passive Salary",
    className: "text-right",
    width: 160,
  },
  {
    name: "isRegistered",
    className: "text-right",
    width: 160,
  },
  {
    name: "Last Active At",
    className: "text-right",
    width: 160,
  },
  {
    name: <span>Status</span>,
    className: "text-right",
    width: 160,
  },
];
