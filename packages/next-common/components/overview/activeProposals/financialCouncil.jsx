import { CHAIN } from "next-common/utils/constants";
import {
  getFinancialCouncilMenu,
  Names,
} from "next-common/utils/consts/menu/financialCouncil";

const itemOptions = {
  [Names.financialMotions]: {
    api: {
      path: "overview/financial-motions",
    },
  },
};

export function getActiveProposalFinancialCouncil({
  summary,
  activeProposals,
}) {
  const menu = getFinancialCouncilMenu(summary);

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
          initData: activeProposals[Names.financialCouncil]?.[item.value],
        },
      };
    });

  return {
    ...menu,
    items,
  };
}
