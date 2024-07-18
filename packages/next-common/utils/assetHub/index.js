import getMetadata from "next-common/services/chain/apis/metadata";

let provider = null;
let api = null;

export async function getAssetHubApi() {
  if (api) {
    return api;
  }

  const wsAssetHubEndpoint = process.env.NEXT_PUBLIC_WS_ASSET_HUB_ENDPOINTS;
  if (!wsAssetHubEndpoint) {
    return null;
  }

  const WsProvider = (await import("@polkadot/api")).WsProvider;
  const ApiPromise = (await import("@polkadot/api")).ApiPromise;

  const endpoints = wsAssetHubEndpoint.split(";");
  provider = new WsProvider(endpoints, 1000);
  const { id, metadata } = await getMetadata(provider);
  api = await ApiPromise.create({
    provider,
    metadata: { [id]: metadata },
  });

  return api;
}
