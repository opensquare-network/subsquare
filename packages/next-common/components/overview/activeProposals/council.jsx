import { CHAIN } from "next-common/utils/constants";
import { getCouncilMenu, Names } from "next-common/utils/consts/menu/council";

const itemOptions = {
  [Names.council]: {
    api: {
      path: "overview/motions",
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
