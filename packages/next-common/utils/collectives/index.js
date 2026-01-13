import { getChainApi } from "../getChainApi";
import getChainSettings from "../consts/settings";
import Chains from "next-common/utils/consts/chains";

let api = null;

export async function getCollectivesApi() {
  if (api) {
    return api;
  }

  const { endpoints } = getChainSettings(Chains.collectives);
  const collectivesEndpoints = endpoints?.map((item) => item.url);
  if (!collectivesEndpoints) {
    throw new Error("Collectives endpoints not found");
  }

  return getChainApi(collectivesEndpoints);
}
