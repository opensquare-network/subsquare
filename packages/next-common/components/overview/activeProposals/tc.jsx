import { CHAIN } from "next-common/utils/constants";
import { getTechCommMenu, Names } from "next-common/utils/consts/menu/tc";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "./columns/common";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeTechCommMotionListItem from "next-common/utils/viewfuncs/collective/normalizeTechCommMotionListItem";
import { overviewApi } from "next-common/services/url";

const itemOptions = {
  techCommProposals: {
    api: {
      path: overviewApi.tcMotions,
    },
    formatter: (data) => normalizeTechCommMotionListItem(CHAIN, data),
    category: businessCategory.tcProposals,
  },
};

export function getActiveProposalTechComm({ summary, activeProposals }) {
  const menu = getTechCommMenu(summary);

  const items = menu.items
    .map((item) => {
      const options = itemOptions[item.value];

      if (options) {
        return {
          ...item,
          ...options,
          api: {
            ...options.api,
            initData: activeProposals[Names.techComm]?.[item.value],
          },
          columns: [
            getProposalPostTitleColumn(),
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
