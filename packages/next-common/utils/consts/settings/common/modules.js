import { cloneDeep, merge } from "lodash-es";

// polkadot
const base = {
  whales: false,

  democracy: {
    referenda: true,
    publicProposals: true,
    externalProposals: true,
    archived: false,
  },
  referenda: false,
  fellowship: false,
  ambassador: false,
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
  communityTreasury: false,
  preimages: true,
};

/**
 *
 * @param {typeof base} modules
 * @returns typeof base
 */
export function mergeChainModules(modules) {
  return merge(cloneDeep(base), modules);
}
