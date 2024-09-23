import { cloneDeep, isObject, merge } from "lodash-es";

// common modules snapshot
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
};

/**
 * if a pallet is true, returns true.
 * if a pallet is an object returns this object;
 *  if the pallet has archived: true, returns false.
 */
function createPalletModules(pallet) {
  return new Proxy(pallet, {
    get(target, key) {
      const value = Reflect.get(target, key);

      if (isObject(value)) {
        if (value.archived) {
          return false;
        }

        return createPalletModules(value);
      }

      return value;
    },
  });
}

/**
 * @param {typeof base} modules
 */
export function mergeChainModules(modules) {
  /** @type {typeof base} */
  const m = createPalletModules(merge(cloneDeep(base), modules));
  return m;
}
