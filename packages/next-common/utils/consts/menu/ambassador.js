import { sumBy } from "lodash-es";
import { getExcludeChains } from "next-common/utils/viewfuncs";
import Chains from "next-common/utils/consts/chains";
import { MenuFellowship } from "@osn/icons/subsquare";
import { collectivesCommonNames } from "next-common/utils/consts/menu/common/collectives";

export const Names = {
  ambassador: "AMBASSADOR",
  ...collectivesCommonNames,
};

export function getAmbassadorMenu(ambassadorTracks = []) {
  const totalActiveCount = sumBy(ambassadorTracks, (t) => t.activeCount || 0);

  return {
    name: Names.ambassador,
    excludeToChains: getExcludeChains([Chains.collectives]),
    activeCount: totalActiveCount,
    icon: <MenuFellowship />,
    pathname: "/ambassador",
    items: [
      {
        value: "ambassador-members",
        name: Names.members,
        pathname: "/ambassador/members",
      },
    ],
  };
}
