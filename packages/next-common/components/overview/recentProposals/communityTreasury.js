import { CHAIN } from "next-common/utils/constants";
import {
  getProposalPostTitleColumn,
  getRequestColumn,
  getStatusTagColumn,
  getVoteSummaryColumnPlaceholder,
} from "./columns";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";
import { usePageProps } from "next-common/context/page";
import {
  getCommunityTreasuryMenu,
  Names,
} from "next-common/utils/consts/menu/communityTreasury";
import normalizeCommunityTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeCommunityTreasuryProposalListItem";

const itemOptions = {
  proposals: {
    api: {
      path: overviewApi.communityTreasuryProposals,
    },
    formatter(data) {
      return normalizeCommunityTreasuryProposalListItem(CHAIN, data);
    },
    category: businessCategory.communityTreasuryProposals,
  },
};

export function useRecentProposalCommunityTreasury() {
  const { overviewSummary, recentProposals } = usePageProps();
  const summary = overviewSummary;

  const menu = getCommunityTreasuryMenu(summary);

  const items = menu.items
    ?.map((item) => {
      const options = itemOptions[item.value];

      if (options) {
        const initData = recentProposals[Names.communityTreasury]?.[item.value];

        return {
          ...item,
          ...options,
          api: {
            ...options.api,
            initData,
          },
          columns: [
            getProposalPostTitleColumn(),
            getRequestColumn(),
            getVoteSummaryColumnPlaceholder(),
            getStatusTagColumn({ category: options.category }),
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
