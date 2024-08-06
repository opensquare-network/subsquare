import { startCase, sumBy } from "lodash-es";
import { getExcludeChains } from "../../viewfuncs";
import Chains from "../chains";
import { MenuFellowship } from "@osn/icons/subsquare";
import getChainSettings from "../settings";
import { collectivesCommonNames } from "next-common/utils/consts/menu/common/collectives";
import dividerConfig from "next-common/utils/consts/menu/common/divider";

export const Names = {
  fellowship: "FELLOWSHIP",
  ...collectivesCommonNames,
};

function getFellowshipCoreMenu() {
  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!chainSettings.hasFellowshipCore) {
    return null;
  }

  return {
    value: "fellowship-core",
    name: Names.core,
    pathname: "/fellowship/core",
    extraMatchNavMenuActivePathnames: [
      "/fellowship/core/params",
      "/fellowship/core/feeds",
    ],
  };
}

function getFellowshipSalaryMenu() {
  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!chainSettings.hasFellowshipCore) {
    return null;
  }

  return {
    value: "fellowship-salary",
    name: Names.salary,
    pathname: "/fellowship/salary",
    extraMatchNavMenuActivePathnames: [
      "/fellowship/salary/feeds",
      "/fellowship/salary/claimants",
      "/fellowship/salary/cycles/[...params]",
    ],
  };
}

function getFellowshipStatisticsMenu() {
  return {
    value: "fellowship-statistics",
    name: Names.statistics,
    pathname: "/fellowship/statistics",
  };
}

function getFellowshipReferendaMenu(
  fellowshipTracks = [],
  currentTrackId,
  totalActiveCount,
) {
  const resolveFellowshipTrackItem = (track) => {
    return {
      value: track.id,
      name: startCase(track.name),
      pathname: `/fellowship/tracks/${track.id}`,
      activeCount: track.activeCount,
      icon: `[${track.id}]`,
      extraMatchNavMenuActivePathnames: [
        track.id === currentTrackId && "/fellowship/referenda/[id]",
      ].filter(Boolean),
    };
  };

  const trackItems = fellowshipTracks.map(resolveFellowshipTrackItem);

  return {
    value: "fellowship-referenda",
    name: "Referenda",
    extraMatchNavMenuActivePathnames: [
      "/fellowship",
      "/fellowship/tracks/[id]",
    ],
    items: [
      {
        value: "all",
        name: Names.all,
        pathname: "/fellowship",
        activeCount: totalActiveCount,
        excludeToSumActives: true,
      },
      ...trackItems,
    ],
  };
}

export function getFellowshipMenu(fellowshipTracks = [], currentTrackId) {
  const totalActiveCount = sumBy(fellowshipTracks, (t) => t.activeCount || 0);

  const menu = {
    name: Names.fellowship,
    excludeToChains: getExcludeChains([
      Chains.development,
      Chains.kusama,
      Chains.collectives,
      Chains.moonriver,
      Chains.moonbeam,
      Chains.bifrost,
      Chains.bifrostPolkadot,
      Chains.westendCollectives,
      Chains.vara,
      Chains.rococo,
    ]),
    activeCount: totalActiveCount,
    icon: <MenuFellowship />,
    pathname: "/fellowship",
    items: [
      {
        value: "fellowship-members",
        name: Names.members,
        pathname: "/fellowship/members",
      },
      getFellowshipCoreMenu(),
      getFellowshipSalaryMenu(),
      getFellowshipStatisticsMenu(),
      dividerConfig,
      getFellowshipReferendaMenu(
        fellowshipTracks,
        currentTrackId,
        totalActiveCount,
      ),
    ].filter(Boolean),
  };

  return menu;
}
