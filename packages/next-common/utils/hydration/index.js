import { getChainApi } from "../getChainApi";

let api = null;

export async function getHydrationApi() {
  if (api) {
    return api;
  }

  const wsHydrationEndpoint = process.env.NEXT_PUBLIC_WS_HYDRATION_ENDPOINTS;
  if (!wsHydrationEndpoint) {
    return null;
  }

  const endpoints = wsHydrationEndpoint.split(";");
  api = getChainApi(endpoints);

  return api;
}
