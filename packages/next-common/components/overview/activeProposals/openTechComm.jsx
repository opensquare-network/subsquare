import {
  getOpenTechCommMenu,
  Names,
} from "next-common/utils/consts/menu/openTechCommittee";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "./columns/common";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";

const itemOptions = {
  openTechCommitteeProposals: {
    api: {
      path: overviewApi.openTCMotions,
    },
  },
};

export function getActiveProposalOpenTechComm({ summary, activeProposals }) {
  const menu = getOpenTechCommMenu(summary);

  const items = menu.items
    .map((item) => {
      const options = itemOptions[item.value];

      if (options) {
        return {
          ...item,
          ...options,
          api: {
            ...options.api,
            initData: activeProposals[Names.openTechCommittee]?.[item.value],
          },
          columns: [
            getProposalPostTitleColumn(),
            getStatusTagColumn({
              category: businessCategory.openTechCommitteeProposals,
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
