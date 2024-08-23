import {
  getCommunityCouncilMenu,
  Names,
} from "next-common/utils/consts/menu/communityCouncil";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
  getVoteSummaryColumnPlaceholder,
} from "./columns";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";
import { toCommunityMotionsListItem } from "next-common/utils/viewfuncs";
import { usePageProps } from "next-common/context/page";

const itemOptions = {
  communityMotions: {
    api: {
      path: overviewApi.communityMotions,
    },
    formatter: toCommunityMotionsListItem,
  },
};

export function useRecentProposalCommunityCouncil() {
  const { overviewSummary, recentProposals } = usePageProps();
  const summary = overviewSummary;

  const menu = getCommunityCouncilMenu(summary);

  const items = menu.items
    .map((item) => {
      const options = itemOptions[item.value];

      if (options) {
        return {
          ...item,
          ...options,
          api: {
            ...options.api,
            initData: recentProposals[Names.communityCouncil]?.[item.value],
          },
          columns: [
            getProposalPostTitleColumn(),
            { className: "w-40" },
            getVoteSummaryColumnPlaceholder(),
            getStatusTagColumn({ category: businessCategory.communityMotions }),
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
