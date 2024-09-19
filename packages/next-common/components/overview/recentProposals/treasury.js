import { CHAIN } from "next-common/utils/constants";
import { getTreasuryMenu } from "next-common/utils/consts/menu/treasury";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import {
  getProposalPostTitleColumn,
  getRequestColumn,
  getSpendRequestColumn,
  getStatusTagColumn,
  getVoteSummaryColumnPlaceholder,
} from "./columns";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeBountyListItem";
import normalizeTipListItem from "next-common/utils/viewfuncs/treasury/normalizeTipListItem";
import { overviewApi } from "next-common/services/url";
import { usePageProps } from "next-common/context/page";
import normalizeTreasurySpendListItem from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";

const itemOptions = {
  proposals: {
    api: {
      path: overviewApi.treasuryProposals,
    },
    formatter(data) {
      return normalizeTreasuryProposalListItem(CHAIN, data);
    },
    category: businessCategory.treasuryProposals,
  },
  spends: {
    api: {
      path: overviewApi.treasurySpends,
    },
    formatter(data) {
      return normalizeTreasurySpendListItem(CHAIN, data);
    },
    category: businessCategory.treasurySpends,
  },
  bounties: {
    api: {
      path: overviewApi.treasuryBounties,
    },
    formatter(data) {
      return normalizeBountyListItem(CHAIN, data);
    },
    category: businessCategory.treasuryBounties,
  },
  "child-bounties": {
    api: {
      path: overviewApi.treasuryChildBounties,
    },
    formatter(data) {
      return normalizeBountyListItem(CHAIN, data);
    },
    category: businessCategory.treasuryChildBounties,
  },
  tips: {
    api: {
      path: overviewApi.treasuryTips,
    },
    formatter(data) {
      return normalizeTipListItem(CHAIN, data);
    },
    category: businessCategory.treasuryTips,
  },
};

export function useRecentProposalTreasury() {
  const { recentSummary, recentProposals } = usePageProps();
  const summary = recentSummary;

  const menu = getTreasuryMenu(summary);

  const items = menu.items
    ?.map((item) => {
      const options = itemOptions[item.value];

      let requestColumn = getRequestColumn();
      if (item.value === "tips") {
        requestColumn.name = "Value";
      }
      if (item.value === "spends") {
        requestColumn = getSpendRequestColumn();
      }

      if (options) {
        return {
          ...item,
          ...options,
          api: {
            ...options.api,
            initData: recentProposals.treasury?.[item.value],
          },
          columns: [
            getProposalPostTitleColumn(),
            requestColumn,
            getVoteSummaryColumnPlaceholder(),
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
