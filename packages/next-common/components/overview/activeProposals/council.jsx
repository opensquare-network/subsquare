import { CHAIN } from "next-common/utils/constants";
import { getCouncilMenu, Names } from "next-common/utils/consts/menu/council";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "./columns/common";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";

const itemOptions = {
  motions: {
    api: {
      path: overviewApi.councilMotions,
    },
  },
};

export function getActiveProposalCouncil({ summary, activeProposals }) {
  const menu = getCouncilMenu(summary);

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
          initData: activeProposals[Names.council]?.[item.value],
        },
        columns: [
          getProposalPostTitleColumn(),
          getStatusTagColumn({ category: businessCategory.councilMotions }),
        ],
      };
    });

  return {
    ...menu,
    items,
  };
}
