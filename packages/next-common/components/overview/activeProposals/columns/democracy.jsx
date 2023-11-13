import { CHAIN } from "next-common/utils/constants";
import { getDemocracyMenu } from "next-common/utils/consts/menu/democracy";
import normalizeProposalListItem from "next-common/utils/viewfuncs/democracy/normalizeProposalListItem";
import normalizeReferendaListItem from "next-common/utils/viewfuncs/democracy/normalizeReferendaListItem";
import normalizeExternalListItem from "next-common/utils/viewfuncs/democracy/normliazeExternalListItem";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
  getVoteSummaryColumn,
} from "./common";
import businessCategory from "next-common/utils/consts/business/category";

const itemOptions = {
  referenda: {
    api: {
      path: "overview/democracy-referenda",
    },
    formatter: (data) => normalizeReferendaListItem(CHAIN, data),
    category: businessCategory.democracyReferenda,
  },
  democracyProposals: {
    api: {
      path: "overview/public-proposals",
    },
    formatter: (data) => normalizeProposalListItem(CHAIN, data),
    category: businessCategory.democracyProposals,
  },
  democracyExternals: {
    api: {
      path: "overview/externals",
    },
    formatter: (data) => normalizeExternalListItem(CHAIN, data),
    category: businessCategory.democracyExternals,
  },
};

export function getActiveProposalDemocracy({ summary, activeProposals }) {
  const menu = getDemocracyMenu(summary);
  const items = menu.items.map((item) => {
    const options = itemOptions[item.value];

    return {
      ...item,
      ...options,
      api: {
        ...options.api,
        initValue: activeProposals.democracy[item.value],
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
