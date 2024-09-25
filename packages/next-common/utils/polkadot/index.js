import { getChainApi } from "../getChainApi";

let api = null;

export async function getPolkadotApi() {
  if (api) {
    return api;
  }

  const wsPolkadotEndpoint = process.env.NEXT_PUBLIC_WS_RELAY_CHAIN_ENDPOINTS;
  if (!wsPolkadotEndpoint) {
    return null;
  }

  const endpoints = wsPolkadotEndpoint.split(";");
  api = getChainApi(endpoints);

  return api;
}
