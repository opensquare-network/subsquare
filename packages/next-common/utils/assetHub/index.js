import { getChainApi } from "../getChainApi";
import getChainSettings from "../consts/settings";
import { CHAIN } from "next-common/utils/constants";
import { getAssetHubChain } from "next-common/utils/chain";
import { getPapi } from "next-common/services/chain/papi";

let api = null;
let papiApi = null;
let papiClient = null;

function getAssetHubEndpoints() {
  const chain = getAssetHubChain(CHAIN);
  const { endpoints } = getChainSettings(chain);
  const assetHubEndpoints = endpoints?.map((item) => item.url);

  if (!assetHubEndpoints) {
    throw new Error("AssetHub endpoints not found");
  }

  return assetHubEndpoints;
}

export async function getAssetHubApi() {
  if (api) {
    return api;
  }

  const assetHubEndpoints = getAssetHubEndpoints();

  return getChainApi(assetHubEndpoints);
}

export async function getAssetHubPapi() {
  if (papiApi) {
    return papiApi;
  }

  const assetHubEndpoints = getAssetHubEndpoints();

  const { api, client } = await getPapi(assetHubEndpoints);

  papiApi = api;
  papiClient = client;

  return api;
}

export async function getAssetHubPapiClient() {
  if (papiClient) {
    return papiClient;
  }

  await getAssetHubPapi();

  return papiClient;
}
