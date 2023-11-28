import {
  getTreasuryCouncilMenu,
  Names,
} from "next-common/utils/consts/menu/treasuryCouncil";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
  getVoteSummaryColumn,
} from "./columns";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";
import normalizeTreasuryCouncilMotionListItem from "next-common/utils/viewfuncs/collective/normalizeTreasuryCouncilMotionListItem";
import { CHAIN } from "next-common/utils/constants";

const itemOptions = {
  motions: {
    api: {
      path: overviewApi.treasuryCouncilMotions,
    },
    formatter: (item) => normalizeTreasuryCouncilMotionListItem(CHAIN, item),
  },
};

export function getActiveProposalTreasuryCouncil({ summary, activeProposals }) {
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
            initData: activeProposals[Names.treasuryCouncil]?.[item.value],
          },
          columns: [
            getProposalPostTitleColumn(),
            { className: "w-40" },
            getVoteSummaryColumn(),
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
