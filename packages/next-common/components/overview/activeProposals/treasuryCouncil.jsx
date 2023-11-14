import { CHAIN } from "next-common/utils/constants";
import {
  getTreasuryCouncilMenu,
  Names,
} from "next-common/utils/consts/menu/treasuryCouncil";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "./columns/common";
import businessCategory from "next-common/utils/consts/business/category";

const itemOptions = {
  motions: {
    api: {
      path: "overview/motions",
    },
  },
};

export function getActiveProposalTreasuryCouncil({ summary, activeProposals }) {
  const menu = getTreasuryCouncilMenu(summary);

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
          initData: activeProposals[Names.treasuryCouncil]?.[item.value],
        },
        columns: [
          getProposalPostTitleColumn(),
          getStatusTagColumn({
            category: businessCategory.treasuryCouncilMotions,
          }),
        ],
      };
    });

  return {
    ...menu,
    items,
  };
}
