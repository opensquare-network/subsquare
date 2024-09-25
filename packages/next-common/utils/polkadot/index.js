import { getChainApi } from "../getChainApi";

let api = null;

export async function getRelayChainApi() {
  if (api) {
    return api;
  }

  const wsRelayChainEndpoint = process.env.NEXT_PUBLIC_WS_RELAY_CHAIN_ENDPOINTS;
  if (!wsRelayChainEndpoint) {
    return null;
  }

  const endpoints = wsRelayChainEndpoint.split(";");
  api = getChainApi(endpoints);

  return api;
}
