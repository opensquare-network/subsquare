import { cloneDeep, merge } from "lodash-es";

// polkadot menu snapshot
const base = {
  // common menu
  discussions: true,

  whales: false,

  // pallet menu
  democracy: {
    referenda: true,
    publicProposals: true,
    externalProposals: true,
    archived: false,
  },
  referenda: false,
  fellowship: false,
  fellowshipTreasury: false,
  ambassador: false,
  treasury: {
    spends: false,
    proposals: true,
    bounties: true,
    childBounties: false,
    tips: true,
  },
  council: {
    archived: false,
  },
  technicalCommittee: {
    archived: false,
  },
  financialCouncil: false,
  communityCouncil: false,
  communityTreasury: false,
  advisoryCommittee: false,
  alliance: false,
  preimages: true,
  proxy: {
    provider: "server",
  },
};

/**
 *
 * @param {typeof base} modules
 * @returns typeof base
 */
export function mergeChainModules(modules) {
  return merge(cloneDeep(base), modules);
}
