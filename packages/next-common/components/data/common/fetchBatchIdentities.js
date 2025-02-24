import { fetchIdentity } from "next-common/services/identity";
import { getIdentityDisplay } from "next-common/utils/identity";

export default async function fetchBatchIdentities(
  identityChain,
  accounts = [],
) {
  const results = await Promise.all(
    accounts.map(async (account) => {
      const identity = await fetchIdentity(identityChain, account);
      const display = getIdentityDisplay(identity);

      return { account, display: display?.toLowerCase() || null };
    }),
  );

  return results.reduce((acc, { account, display }) => {
    if (display) {
      acc[account] = display;
    }

    return acc;
  }, {});
}
