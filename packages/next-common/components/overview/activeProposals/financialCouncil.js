import {
  getFinancialCouncilMenu,
  Names,
} from "next-common/utils/consts/menu/financialCouncil";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
  getVoteSummaryColumnPlaceholder,
} from "./columns";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";
import { toFinancialMotionsListItem } from "next-common/utils/viewfuncs";

const itemOptions = {
  financialMotions: {
    api: {
      path: overviewApi.financialMotions,
    },
    formatter: toFinancialMotionsListItem,
  },
};

export function getActiveProposalFinancialCouncil({
  summary,
  activeProposals,
}) {
  const menu = getFinancialCouncilMenu(summary);

  const items = menu.items
    .map((item) => {
      const options = itemOptions[item.value];

      if (options) {
        return {
          ...item,
          ...options,
          api: {
            ...options.api,
            initData: activeProposals[Names.financialCouncil]?.[item.value],
          },
          columns: [
            getProposalPostTitleColumn(),
            { className: "w-40" },
            getVoteSummaryColumnPlaceholder(),
            getStatusTagColumn({ type: businessCategory.financialMotions }),
          ],
        };
      }
    })
    .filter(Boolean);

  return {
    ...menu,
    items,
  };
}
