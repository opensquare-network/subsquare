import { normalizeAddress } from "./address";

export function normalizedSubstrateAccounts(accounts = [], walletName) {
  return accounts.map((item) => {
    return {
      ...item,
      address: normalizeAddress(item.address),
      meta: {
        name: item.name,
        source: walletName,
      },
    };
  });
}
