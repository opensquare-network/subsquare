import { backendApi } from "next-common/services/nextApi";
import getChainSettings from "next-common/utils/consts/settings";
import {
  ambassadorStatisticsMemberRankHistoryApi,
  ambassadorStatisticsUsersApi,
  fellowshipStatisticsMemberRankHistoryApi,
  fellowshipStatisticsUsersApi,
} from "next-common/services/url";

const sectionConfig = {
  fellowship: {
    module: "fellowship",
    statisticsApi: fellowshipStatisticsUsersApi,
    rankHistoryApi: fellowshipStatisticsMemberRankHistoryApi,
    statisticsProp: "fellowshipUserStatistics",
    rankHistoryProp: "fellowshipUserRankHistory",
  },
  ambassador: {
    module: "ambassador",
    statisticsApi: ambassadorStatisticsUsersApi,
    rankHistoryApi: ambassadorStatisticsMemberRankHistoryApi,
    statisticsProp: "ambassadorUserStatistics",
    rankHistoryProp: "ambassadorUserRankHistory",
  },
};

export async function fetchUserStatisticsProps(address, section) {
  const config = sectionConfig[section];
  if (!config) {
    return {};
  }

  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!chainSettings.modules[config.module]) {
    return {};
  }

  const { result } = await backendApi.fetch(config.statisticsApi(address));

  return {
    [config.statisticsProp]: result ?? null,
  };
}

export async function fetchUserRankHistoryProps(address, section) {
  const config = sectionConfig[section];
  if (!config) {
    return {};
  }

  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!chainSettings.modules[config.module]) {
    return {};
  }

  const { result } = await backendApi.fetch(config.rankHistoryApi(address));

  return {
    [config.rankHistoryProp]: result ?? null,
  };
}
