import {
  getTreasuryCouncilMenu,
  Names,
} from "next-common/utils/consts/menu/treasuryCouncil";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "./columns/common";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";

const itemOptions = {
  motions: {
    api: {
      path: overviewApi.treasuryCouncilMotions,
    },
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
