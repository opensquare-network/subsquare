import { addressToPublicKey } from "./address";

export async function checkProxy(api, delegator, toCheckDelegate) {
  const data = await api.query.proxy.proxies(delegator);
  const [proxies] = data.toJSON() || [];

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

  const success = proxyTypes.some((item) =>
    ["Any", "NonTransfer", "Governance"].includes(item),
  );

  return {
    proxyTypes,
    success,
  };
}
