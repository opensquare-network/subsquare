export const commonModules = {
  whales: false,

  democracy: {
    referenda: true,
    publicProposals: true,
    externalProposals: true,
    archived: false,
  },
  referenda: false,
  fellowship: false,
  treasury: {
    spends: false,
    proposals: true,
    bounties: true,
    childBounties: false,
    tips: true,
  },
  council: {
    motions: true,
    members: true,
    archived: false,
  },
  technicalCommittee: {
    proposals: true,
    members: true,
    archived: false,
  },
  preimages: true,
};
