import { CHAIN } from "next-common/utils/constants";
import { getCouncilMenu, Names } from "next-common/utils/consts/menu/council";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "./columns/common";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";
import normalizeCouncilMotionListItem from "next-common/utils/viewfuncs/collective/normalizeCouncilMotionListItem";

const itemOptions = {
  motions: {
    api: {
      path: overviewApi.councilMotions,
    },
    formatter: (item) => normalizeCouncilMotionListItem(CHAIN, item),
  },
};

export function getActiveProposalCouncil({ summary, activeProposals }) {
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
            initData: activeProposals[Names.council]?.[item.value],
          },
          columns: [
            getProposalPostTitleColumn(),
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
