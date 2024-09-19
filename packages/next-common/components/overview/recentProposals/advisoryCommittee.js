import {
  getAdvisoryCommitteeMenu,
  Names,
} from "next-common/utils/consts/menu/advisoryCouncil";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
  getVoteSummaryColumnPlaceholder,
} from "./columns";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";
import { toAdvisoryMotionsListItem } from "next-common/utils/viewfuncs";
import { usePageProps } from "next-common/context/page";

const itemOptions = {
  advisoryMotions: {
    api: {
      path: overviewApi.advisoryMotions,
    },
    formatter: toAdvisoryMotionsListItem,
  },
};

export function useRecentProposalAdvisoryCommittee() {
  const { recentSummary, recentProposals } = usePageProps();
  const summary = recentSummary;

  const menu = getAdvisoryCommitteeMenu(summary);

  const items = menu.items
    .map((item) => {
      const options = itemOptions[item.value];

      if (options) {
        return {
          ...item,
          ...options,
          api: {
            ...options.api,
            initData: recentProposals[Names.advisoryCommittee]?.[item.value],
          },
          columns: [
            getProposalPostTitleColumn(),
            { className: "w-40" },
            getVoteSummaryColumnPlaceholder(),
            getStatusTagColumn({ category: businessCategory.advisoryMotions }),
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
