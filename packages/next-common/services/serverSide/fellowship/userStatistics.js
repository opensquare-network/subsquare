import { backendApi } from "next-common/services/nextApi";
import getChainSettings from "next-common/utils/consts/settings";
import {
  fellowshipStatisticsMemberRankHistoryApi,
  fellowshipStatisticsUsersApi,
} from "next-common/services/url";

/**
 * Fetch a member's fellowship statistics on the server side.
 * Ambassador is not in use yet, so only the fellowship section is handled.
 */
export async function fetchUserStatisticsProps(address, section) {
  if (section !== "fellowship") {
    return {};
  }

  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!chainSettings.modules.fellowship) {
    return {};
  }

  const { result } = await backendApi.fetch(
    fellowshipStatisticsUsersApi(address),
  );

  return {
    fellowshipUserStatistics: result ?? null,
  };
}

/**
 * Fetch a member's fellowship rank history on the server side.
 * The backend has no ambassador rank history endpoint, so this only runs on
 * the fellowship section; ambassador pages just show no rank data.
 */
export async function fetchUserRankHistoryProps(address, section) {
  if (section !== "fellowship") {
    return {};
  }

  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!chainSettings.modules.fellowship) {
    return {};
  }

  const { result } = await backendApi.fetch(
    fellowshipStatisticsMemberRankHistoryApi(address),
  );

  return {
    fellowshipUserRankHistory: result ?? null,
  };
}
