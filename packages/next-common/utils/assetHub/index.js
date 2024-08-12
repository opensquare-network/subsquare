import { getChainApi } from "../getChainApi";

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
  api = getChainApi(endpoints);

  return api;
}
