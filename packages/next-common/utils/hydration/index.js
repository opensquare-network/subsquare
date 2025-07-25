import { getChainApi } from "../getChainApi";
import getChainSettings from "../consts/settings";
import { CHAIN } from "next-common/utils/constants";

let api = null;

export async function getHydrationApi() {
  if (api) {
    return api;
  }

  const { parachainEndpoints } = getChainSettings(CHAIN);
  const hydrationEndpoints = parachainEndpoints?.hydration;

  if (hydrationEndpoints && hydrationEndpoints?.length > 0) {
    api = getChainApi(hydrationEndpoints);
    return api;
  }
}
