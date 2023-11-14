import { CHAIN } from "next-common/utils/constants";
import {
  getOpenTechCommMenu,
  Names,
} from "next-common/utils/consts/menu/openTechCommittee";

const itemOptions = {
  [Names.openTechCommitteeProposals]: {
    api: {
      path: "overview/open-tc-motions",
    },
  },
};

export function getActiveProposalsOpenTechComm({ summary, activeProposals }) {
  const menu = getOpenTechCommMenu(summary);

  const items = menu.items
    ?.filter((item) => item.activeCount)
    ?.filter((item) => !item.excludeToChains?.includes(CHAIN))
    .map((item) => {
      const options = itemOptions[item.value];

      return {
        ...item,
        ...options,
        api: {
          ...options.api,
          initData: activeProposals[Names.openTechCommittee]?.[item.value],
        },
      };
    });

  return {
    ...menu,
    items,
  };
}
