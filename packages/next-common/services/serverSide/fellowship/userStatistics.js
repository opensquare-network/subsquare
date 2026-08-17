import { backendApi } from "next-common/services/nextApi";
import getChainSettings from "next-common/utils/consts/settings";
import {
  ambassadorStatisticsUsersApi,
  fellowshipStatisticsUsersApi,
} from "next-common/services/url";

/**
 * Fetch fellowship / ambassador user statistics on the server side.
 * Skips the request when the chain doesn't support the module, to avoid
 * hitting a backend that has no fellowship / ambassador statistics API.
 */
export async function fetchUserStatisticsProps(address, section) {
  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);

  if (section === "fellowship") {
    if (!chainSettings.modules.fellowship) {
      return {};
    }
  } else if (section === "ambassador") {
    if (!chainSettings.modules.ambassador) {
      return {};
    }
  } else {
    return {};
  }

  const statisticsApi =
    section === "ambassador"
      ? ambassadorStatisticsUsersApi(address)
      : fellowshipStatisticsUsersApi(address);

  const { result } = await backendApi.fetch(statisticsApi);

  const key =
    section === "ambassador"
      ? "ambassadorUserStatistics"
      : "fellowshipUserStatistics";

  return {
    [key]: result ?? null,
  };
}
