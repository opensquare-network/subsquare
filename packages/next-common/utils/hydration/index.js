import { getChainApi } from "../getChainApi";

let api = null;

export async function getHydrationApi() {
  if (api) {
    return api;
  }

  const hydrationWsEndpointStr = process.env.NEXT_PUBLIC_WS_HYDRATION_ENDPOINTS;
  if (!hydrationWsEndpointStr) {
    return null;
  }

  const endpoints = hydrationWsEndpointStr.split(";");
  api = getChainApi(endpoints);

  return api;
}
