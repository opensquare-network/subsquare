import { getCouncilMenu } from "next-common/utils/consts/menu/council";

const itemOptions = {
  motions: {
    api: {
      path: "overview/motions",
    },
  },
};

export function getActiveProposalCouncil({ summary, activeProposals }) {
  const menu = getCouncilMenu(summary);

  const items = menu.items
    .filter((item) => item.activeCount)
    .map((item) => {
      const options = itemOptions[item.value];

      return {
        ...item,
        ...options,
        api: {
          ...options.api,
          initData: activeProposals.council?.[item.value],
        },
      };
    });

  return {
    ...menu,
    items,
  };
}
