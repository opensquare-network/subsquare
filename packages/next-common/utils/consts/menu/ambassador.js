import { startCase, sumBy } from "lodash-es";
import { MenuAmbassador } from "@osn/icons/subsquare";
import { collectivesCommonNames } from "next-common/utils/consts/menu/common/collectives";
import dividerConfig from "next-common/utils/consts/menu/common/divider";
import getChainSettings from "next-common/utils/consts/settings";

export const Names = {
  ambassador: "AMBASSADOR",
  ...collectivesCommonNames,
};

function getAmbassadorReferendaMenu(
  ambassadorTracks = [],
  currentTrackId,
  totalActiveCount,
) {
  const resolveAmbassadorTrackItem = (track) => {
    return {
      value: track.id,
      name: startCase(track.name),
      pathname: `/ambassador/tracks/${track.id}`,
      activeCount: track.activeCount,
      icon: `[${track.id}]`,
      extraMatchNavMenuActivePathnames: [
        track.id === currentTrackId && "/ambassador/referenda/[id]",
      ].filter(Boolean),
    };
  };

  const trackItems = ambassadorTracks.map(resolveAmbassadorTrackItem);

  return {
    value: "ambassador-referenda",
    name: "Referenda",
    extraMatchNavMenuActivePathnames: [
      "/ambassador",
      "/ambassador/tracks/[id]",
    ],
    items: [
      {
        value: "all",
        name: Names.all,
        pathname: "/ambassador/referenda",
        activeCount: totalActiveCount,
        excludeToSumActives: true,
      },
      ...trackItems,
    ],
  };
}

function getAmbassadorCoreMenu() {
  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!chainSettings.modules.ambassador) {
    return null;
  }

  return {
    value: "ambassador-core",
    name: Names.core,
    pathname: "/ambassador/core",
    extraMatchNavMenuActivePathnames: [
      "/ambassador/core/params",
      "/ambassador/core/feeds",
    ],
  };
}

function getAmbassadorSalaryMenu() {
  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!chainSettings.modules.ambassador) {
    return null;
  }

  return {
    value: "ambassador-salary",
    name: Names.salary,
    pathname: "/ambassador/salary",
    extraMatchNavMenuActivePathnames: [
      "/ambassador/salary/feeds",
      "/ambassador/salary/claimants",
      "/ambassador/salary/cycles/[...params]",
    ],
  };
}

export function getAmbassadorMenu(ambassadorTracks = [], currentTrackId) {
  const totalActiveCount = sumBy(ambassadorTracks, (t) => t.activeCount || 0);

  return {
    name: Names.ambassador,
    activeCount: totalActiveCount,
    icon: <MenuAmbassador />,
    pathname: "/ambassador",
    items: [
      {
        value: "ambassador-members",
        name: Names.members,
        pathname: "/ambassador/members",
      },
      getAmbassadorCoreMenu(),
      getAmbassadorSalaryMenu(),
      dividerConfig,
      getAmbassadorReferendaMenu(
        ambassadorTracks,
        currentTrackId,
        totalActiveCount,
      ),
    ],
  };
}
