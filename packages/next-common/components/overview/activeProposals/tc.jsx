import { CHAIN } from "next-common/utils/constants";
import { getTechCommMenu, Names } from "next-common/utils/consts/menu/tc";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "./columns/common";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeTechCommMotionListItem from "next-common/utils/viewfuncs/collective/normalizeTechCommMotionListItem";

const itemOptions = {
  techCommProposals: {
    api: {
      path: "overview/tc-motions",
    },
    formatter: (data) => normalizeTechCommMotionListItem(CHAIN, data),
    category: businessCategory.tcProposals,
  },
};

export function getActiveProposalTechComm({ summary, activeProposals }) {
  const menu = getTechCommMenu(summary);

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
          initData: activeProposals[Names.techComm]?.[item.value],
        },
        columns: [
          getProposalPostTitleColumn(),
          getStatusTagColumn({ category: options.category }),
        ],
      };
    });

  return {
    ...menu,
    items,
  };
}
