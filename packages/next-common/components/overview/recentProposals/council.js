import { CHAIN } from "next-common/utils/constants";
import { getCouncilMenu, Names } from "next-common/utils/consts/menu/council";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
  getVoteSummaryColumnPlaceholder,
} from "./columns";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";
import normalizeCouncilMotionListItem from "next-common/utils/viewfuncs/collective/normalizeCouncilMotionListItem";
import { usePageProps } from "next-common/context/page";

const itemOptions = {
  motions: {
    api: {
      path: overviewApi.councilMotions,
    },
    formatter: (item) => normalizeCouncilMotionListItem(CHAIN, item),
  },
};

export function useRecentProposalCouncil() {
  const { recentSummary, recentProposals } = usePageProps();
  const summary = recentSummary;

  const menu = getCouncilMenu(summary);

  const items = menu.items
    .map((item) => {
      const options = itemOptions[item.value];

      if (options) {
        return {
          ...item,
          ...options,
          api: {
            ...options.api,
            initData: recentProposals[Names.council]?.[item.value],
          },
          columns: [
            getProposalPostTitleColumn(),
            { className: "w-40" },
            getVoteSummaryColumnPlaceholder(),
            getStatusTagColumn({ category: businessCategory.councilMotions }),
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
