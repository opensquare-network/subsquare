import { getChainApi } from "../getChainApi";

let api = null;

export async function getAssetHubApi() {
  if (api) {
    return api;
  }

  const wsAssetHubEndpoint = process.env.NEXT_PUBLIC_WS_RELAY_CHAIN_ENDPOINTS;
  if (!wsAssetHubEndpoint) {
    return null;
  }

  const endpoints = wsAssetHubEndpoint.split(";");
  api = getChainApi(endpoints);

  return api;
}
