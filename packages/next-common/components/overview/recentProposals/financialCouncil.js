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
import { usePageProps } from "next-common/context/page";

const itemOptions = {
  financialMotions: {
    api: {
      path: overviewApi.financialMotions,
    },
    formatter: toFinancialMotionsListItem,
  },
};

export function useRecentProposalFinancialCouncil() {
  const { recentSummary, recentProposals } = usePageProps();
  const summary = recentSummary;

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
            initData: recentProposals[Names.financialCouncil]?.[item.value],
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
