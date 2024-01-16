import { addressToPublicKey } from "./address";
import chains from "next-common/utils/consts/chains";

export async function checkProxy(api, delegator, toCheckDelegate) {
  const data = await api.query.proxy.proxies(delegator);
  const [proxies] = data.toJSON() || [];
  const chain = process.env.NEXT_PUBLIC_CHAIN;

  const proxyTypes = (proxies || [])
    .filter((item) => {
      const delegateKey = addressToPublicKey(item.delegate);
      const toCheckKey = addressToPublicKey(toCheckDelegate);

      if (delegateKey !== toCheckKey) {
        return false;
      }

      return true;
    })
    .map((item) => item.proxyType);

  const types = ["Any", "NonTransfer", "Governance"];
  if ([chains.collectives, chains.westendCollectives].includes(chain)) {
    types.push("Alliance", "Fellowship");
  }

  const success = proxyTypes.some((item) => types.includes(item));

  return {
    proxyTypes,
    success,
  };
}
