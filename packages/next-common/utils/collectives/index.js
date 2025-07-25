import { getChainApi } from "../getChainApi";
import { getChainSettings } from "../consts/settings";
import { CHAIN } from "next-common/utils/constants";

let api = null;

export async function getCollectivesApi() {
  if (api) {
    return api;
  }

  const { parachainEndpoints } = getChainSettings(CHAIN);
  const collectivesEndpoints = parachainEndpoints?.collectives;
  if (!collectivesEndpoints) {
    return null;
  }

  return getChainApi(collectivesEndpoints);
}
