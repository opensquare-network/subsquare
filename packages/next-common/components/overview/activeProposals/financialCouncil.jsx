import { CHAIN } from "next-common/utils/constants";
import {
  getFinancialCouncilMenu,
  Names,
} from "next-common/utils/consts/menu/financialCouncil";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "./columns/common";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";

const itemOptions = {
  financialMotions: {
    api: {
      path: overviewApi.financialMotions,
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
        columns: [
          getProposalPostTitleColumn(),
          getStatusTagColumn({ type: businessCategory.financialMotions }),
        ],
      };
    });

  return {
    ...menu,
    items,
  };
}
