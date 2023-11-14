import { CHAIN } from "next-common/utils/constants";
import { getCouncilMenu, Names } from "next-common/utils/consts/menu/council";
import isMoonChain from "next-common/utils/isMoonChain";

const itemOptions = {
  [Names.council]: {
    api: {
      path: isMoonChain() ? "overview/moon-council" : "overview/motions",
    },
  },
};

export function getActiveProposalCouncil({ summary, activeProposals }) {
  const menu = getCouncilMenu(summary);

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
          initData: activeProposals[Names.council]?.[item.value],
        },
      };
    });

  return {
    ...menu,
    items,
  };
}
