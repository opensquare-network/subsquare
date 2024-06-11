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
import { usePageProps } from "next-common/context/page";

const itemOptions = {
  openTechCommitteeProposals: {
    api: {
      path: overviewApi.openTCMotions,
    },
    formatter: (item) => normalizeOpenTechCommProposalListItem(CHAIN, item),
  },
};

export function useRecentProposalOpenTechComm() {
  const { summary, recentProposals } = usePageProps();

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
            initData: recentProposals[Names.openTechCommittee]?.[item.value],
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
