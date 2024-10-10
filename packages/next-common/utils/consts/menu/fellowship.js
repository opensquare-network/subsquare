import { startCase, sumBy } from "lodash-es";
import { MenuFellowship } from "@osn/icons/subsquare";
import getChainSettings from "../settings";
import { collectivesCommonNames } from "next-common/utils/consts/menu/common/collectives";
import dividerConfig from "next-common/utils/consts/menu/common/divider";
import { isCollectivesChain } from "next-common/utils/chain";

export const Names = {
  fellowship: "FELLOWSHIP",
  ...collectivesCommonNames,
};

function getFellowshipCoreMenu() {
  const { modules } = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!modules?.fellowship?.core) {
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
  const { modules } = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!modules?.fellowship?.core) {
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
  if (!isCollectivesChain(process.env.NEXT_PUBLIC_CHAIN)) {
    return null;
  }

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
      "/fellowship/referenda/statistics",
      "/fellowship/tracks/[id]",
    ],
    items: [
      {
        value: "all",
        name: Names.all,
        pathname: "/fellowship",
        extraMatchNavMenuActivePathnames: [
          "/fellowship",
          "/fellowship/referenda/statistics",
        ],
        activeCount: totalActiveCount,
        excludeToSumActives: true,
      },
      ...trackItems,
    ],
  };
}

function getFellowshipTreasuryMenu(overviewSummary) {
  const { modules } = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!modules?.fellowshipTreasury) {
    return null;
  }

  const fellowshipTreasurySpends =
    overviewSummary?.fellowshipTreasurySpends || {};
  return {
    value: "fellowship-treasury",
    name: Names.treasury,
    extraMatchNavMenuActivePathnames: [
      "/fellowship/treasury/spends",
      "/fellowship/treasury/spends/[id]",
    ],
    activeCount: fellowshipTreasurySpends.active || 0,
    items: [
      {
        value: "fellowship-treasury-spends",
        name: Names.treasurySpends,
        pathname: "/fellowship/treasury/spends",
        extraMatchNavMenuActivePathnames: [
          "/fellowship/treasury/spends",
          "/fellowship/treasury/spends/[id]",
        ],
        activeCount: fellowshipTreasurySpends.active || 0,
      },
    ],
  };
}

export function getFellowshipMenu(overviewSummary, currentTrackId) {
  const fellowshipTracks = overviewSummary?.fellowshipReferendaTracks || [];
  const totalActiveCount = sumBy(fellowshipTracks, (t) => t.activeCount || 0);

  const menu = {
    name: Names.fellowship,
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
      dividerConfig,

      getFellowshipTreasuryMenu(overviewSummary),
    ].filter(Boolean),
  };

  return menu;
}
