export const proposalColumnDefinition = {
  name: "Proposal",
  style: {
    textAlign: "left",
    minWidth: "230px",
    paddingRight: 16,
  },
};

export const voteColumnDefinition = {
  name: "Vote for",
  style: { textAlign: "left", width: 264 },
};

export const statusColumnDefinition = {
  name: "Status",
  style: { textAlign: "right", width: 160 },
};

export const actionColumnDefinition = {
  name: "",
  style: { textAlign: "right", width: 80 },
};

export const commonVoteColumnsDefinition = [
  proposalColumnDefinition,
  voteColumnDefinition,
  statusColumnDefinition,
  actionColumnDefinition,
];
