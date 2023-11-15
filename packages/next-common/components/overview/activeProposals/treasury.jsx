import { CHAIN } from "next-common/utils/constants";
import { getTreasuryMenu } from "next-common/utils/consts/menu/treasury";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import {
  getProposalPostTitleColumn,
  getRequestColumn,
  getStatusTagColumn,
} from "./columns/common";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeBountyListItem";
import normalizeTipListItem from "next-common/utils/viewfuncs/treasury/normalizeTipListItem";
import { overviewApi } from "next-common/services/url";

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

export function getActiveProposalTreasury({ summary, activeProposals }) {
  const menu = getTreasuryMenu(summary);

  const items = menu.items
    ?.map((item) => {
      const options = itemOptions[item.value];

      if (options) {
        return {
          ...item,
          ...options,
          api: {
            ...options.api,
            initData: activeProposals.treasury?.[item.value],
          },
          columns: [
            getProposalPostTitleColumn(),
            getRequestColumn(),
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
