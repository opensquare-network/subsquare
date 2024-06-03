import { ApiPromise, WsProvider } from "@polkadot/api";

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

  const endpoints = wsAssetHubEndpoint.split(";");
  provider = new WsProvider(endpoints, 1000);

  api = await ApiPromise.create({ provider });

  return api;
}
