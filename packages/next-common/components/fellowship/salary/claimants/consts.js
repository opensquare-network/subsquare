const CLAIM_STATS = {
  Nothing: "Nothing",
  Attempted: "Attempted",
  Registered: "Registered",
};

export const claimStatsValues = Object.values(CLAIM_STATS);

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
    name: "Status",
    className: "text-right",
    width: 160,
  },
];
