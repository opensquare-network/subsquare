import { getChainApi } from "../getChainApi";

let api = null;

export async function getCollectivesApi() {
  if (api) {
    return api;
  }

  const wsCollectivesEndpoint =
    process.env.NEXT_PUBLIC_WS_COLLECTIVES_ENDPOINTS;
  if (!wsCollectivesEndpoint) {
    return null;
  }

  const endpoints = wsCollectivesEndpoint.split(";");
  api = getChainApi(endpoints);

  return api;
}
