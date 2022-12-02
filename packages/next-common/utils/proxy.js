import { addressToPublicKey } from "./address";

export async function checkProxy(api, delegator, toCheckDelegate) {
  const data = await api.query.proxy.proxies(delegator);
  const [proxies] = data.toJSON() || [];

  return (proxies || []).some(({ delegate: itemDelegate, proxyType }) => {
    const delegateKey = addressToPublicKey(itemDelegate);
    const toCheckKey = addressToPublicKey(toCheckDelegate);

    if (delegateKey !== toCheckKey) {
      return false;
    }

    return ["Any", "NonTransfer", "Governance", "Assets"].includes(proxyType);
  });
}
