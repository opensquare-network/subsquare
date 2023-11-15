import { CHAIN } from "next-common/utils/constants";
import {
  getAdvisoryCommitteeMenu,
  Names,
} from "next-common/utils/consts/menu/advisoryCouncil";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "./columns/common";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";

const itemOptions = {
  advisoryMotions: {
    api: {
      path: overviewApi.advisoryMotions,
    },
  },
};

export function getActiveProposalAdvisoryCommittee({
  summary,
  activeProposals,
}) {
  const menu = getAdvisoryCommitteeMenu(summary);

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
          initData: activeProposals[Names.advisoryMotions]?.[item.value],
        },
        columns: [
          getProposalPostTitleColumn(),
          getStatusTagColumn({ category: businessCategory.advisoryMotions }),
        ],
      };
    });

  return {
    ...menu,
    items,
  };
}
