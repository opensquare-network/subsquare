import { getChainApi } from "../getChainApi";
import getChainSettings from "../consts/settings";
import { CHAIN } from "next-common/utils/constants";
import { getAssetHubChain } from "next-common/utils/chain";

let api = null;

export async function getAssetHubApi() {
  if (api) {
    return api;
  }

  const chain = getAssetHubChain(CHAIN);
  const { endpoints } = getChainSettings(chain);
  const assetHubEndpoints = endpoints?.map((item) => item.url);
  if (!assetHubEndpoints) {
    throw new Error("AssetHub endpoints not found");
  }

  return getChainApi(assetHubEndpoints);
}
