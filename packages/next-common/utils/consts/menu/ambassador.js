import { startCase, sumBy } from "lodash-es";
import { getExcludeChains } from "next-common/utils/viewfuncs";
import Chains from "next-common/utils/consts/chains";
import { MenuAmbassador } from "@osn/icons/subsquare";
import { collectivesCommonNames } from "next-common/utils/consts/menu/common/collectives";
import dividerConfig from "next-common/utils/consts/menu/common/divider";

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

export function getAmbassadorMenu(ambassadorTracks = [], currentTrackId) {
  const totalActiveCount = sumBy(ambassadorTracks, (t) => t.activeCount || 0);

  return {
    name: Names.ambassador,
    excludeToChains: getExcludeChains([Chains.collectives]),
    activeCount: totalActiveCount,
    icon: <MenuAmbassador />,
    pathname: "/ambassador",
    items: [
      {
        value: "ambassador-members",
        name: Names.members,
        pathname: "/ambassador/members",
      },
      {
        value: "ambassador-salary",
        name: Names.salary,
        pathname: "/ambassador/salary",
      },
      dividerConfig,
      getAmbassadorReferendaMenu(
        ambassadorTracks,
        currentTrackId,
        totalActiveCount,
      ),
    ],
  };
}
