import {
  getTreasuryCouncilMenu,
  Names,
} from "next-common/utils/consts/menu/treasuryCouncil";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
  getVoteSummaryColumnPlaceholder,
} from "./columns";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";
import normalizeTreasuryCouncilMotionListItem from "next-common/utils/viewfuncs/collective/normalizeTreasuryCouncilMotionListItem";
import { CHAIN } from "next-common/utils/constants";
import { usePageProps } from "next-common/context/page";

const itemOptions = {
  motions: {
    api: {
      path: overviewApi.treasuryCouncilMotions,
    },
    formatter: (item) => normalizeTreasuryCouncilMotionListItem(CHAIN, item),
  },
};

export function useRecentProposalTreasuryCouncil() {
  const { summary, recentProposals } = usePageProps();

  const menu = getTreasuryCouncilMenu(summary);

  const items = menu.items
    .map((item) => {
      const options = itemOptions[item.value];

      if (options) {
        return {
          ...item,
          ...options,
          api: {
            ...options.api,
            initData: recentProposals[Names.treasuryCouncil]?.[item.value],
          },
          columns: [
            getProposalPostTitleColumn(),
            { className: "w-40" },
            getVoteSummaryColumnPlaceholder(),
            getStatusTagColumn({
              category: businessCategory.treasuryCouncilMotions,
            }),
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
