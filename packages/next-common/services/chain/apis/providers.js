const providerMap = {};

export default async function getApiProvider(endpoint) {
  const maybe = providerMap[endpoint];
  if (maybe) {
    return maybe;
  }

  const WsProvider = (await import("@polkadot/api")).WsProvider;
  const provider = new WsProvider(endpoint, 1000);
  providerMap[endpoint] = provider;
  return provider;
}

export function getApiProviderMap() {
  return providerMap;
}
