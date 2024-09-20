import { CHAIN } from "next-common/utils/constants";
import { getDemocracyMenu } from "next-common/utils/consts/menu/democracy";
import normalizeProposalListItem from "next-common/utils/viewfuncs/democracy/normalizeProposalListItem";
import normalizeReferendaListItem from "next-common/utils/viewfuncs/democracy/normalizeReferendaListItem";
import normalizeExternalListItem from "next-common/utils/viewfuncs/democracy/normliazeExternalListItem";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
  getVoteSummaryColumn,
} from "./columns";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";
import { usePageProps } from "next-common/context/page";

const itemOptions = {
  referenda: {
    api: {
      path: overviewApi.democracyReferenda,
    },
    formatter(data) {
      return normalizeReferendaListItem(CHAIN, data);
    },
    category: businessCategory.democracyReferenda,
  },
  democracyProposals: {
    api: {
      path: overviewApi.democracyPublicProposals,
    },
    formatter(data) {
      return normalizeProposalListItem(CHAIN, data);
    },
    category: businessCategory.democracyProposals,
  },
  democracyExternals: {
    api: {
      path: overviewApi.democracyExternalProposals,
    },
    formatter(data) {
      return normalizeExternalListItem(CHAIN, data);
    },
    category: businessCategory.democracyExternals,
  },
};

export function useRecentProposalDemocracy() {
  const { recentSummary, recentProposals } = usePageProps();
  const summary = recentSummary;

  const menu = getDemocracyMenu(summary);
  const items = menu.items
    .map((item) => {
      const options = itemOptions[item.value];

      if (options) {
        return {
          ...item,
          ...options,
          api: {
            ...options.api,
            initData: recentProposals.democracy?.[item.value],
          },
          columns: [
            getProposalPostTitleColumn(),
            { className: "w-40" },
            getVoteSummaryColumn({
              type: businessCategory.democracyReferenda,
            }),
            getStatusTagColumn({ category: options.category }),
          ].filter(Boolean),
        };
      }
    })
    .filter(Boolean);

  return {
    ...menu,
    items,
  };
}
