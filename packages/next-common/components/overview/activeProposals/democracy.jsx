import { CHAIN } from "next-common/utils/constants";
import { getDemocracyMenu } from "next-common/utils/consts/menu/democracy";
import normalizeProposalListItem from "next-common/utils/viewfuncs/democracy/normalizeProposalListItem";
import normalizeReferendaListItem from "next-common/utils/viewfuncs/democracy/normalizeReferendaListItem";
import normalizeExternalListItem from "next-common/utils/viewfuncs/democracy/normliazeExternalListItem";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
  getVoteSummaryColumn,
} from "./columns/common";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";

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

export function getActiveProposalDemocracy({ summary, activeProposals }) {
  const menu = getDemocracyMenu(summary);
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
          initData: activeProposals.democracy?.[item.value],
        },
        columns: [
          getProposalPostTitleColumn(),
          item.value === "referenda" &&
            getVoteSummaryColumn({ type: businessCategory.democracyReferenda }),
          getStatusTagColumn({ category: options.category }),
        ].filter(Boolean),
      };
    });

  return {
    ...menu,
    items,
  };
}
