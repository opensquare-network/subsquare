import {
  getOpenTechCommMenu,
  Names,
} from "next-common/utils/consts/menu/openTechCommittee";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
  getVoteSummaryColumnPlaceholder,
} from "./columns";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";
import normalizeOpenTechCommProposalListItem from "next-common/utils/viewfuncs/collective/normalizeOpenTechCommProposalListItem";
import { CHAIN } from "next-common/utils/constants";

const itemOptions = {
  openTechCommitteeProposals: {
    api: {
      path: overviewApi.openTCMotions,
    },
    formatter: (item) => normalizeOpenTechCommProposalListItem(CHAIN, item),
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
            { className: "w-40" },
            getVoteSummaryColumnPlaceholder(),
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
