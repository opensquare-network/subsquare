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

const itemOptions = {
  proposals: {
    api: {
      path: "overview/treasury-proposals",
    },
    formatter(data) {
      return normalizeTreasuryProposalListItem(CHAIN, data);
    },
    category: businessCategory.treasuryProposals,
  },
  bounties: {
    api: {
      path: "overview/bounties",
    },
    formatter(data) {
      return normalizeBountyListItem(CHAIN, data);
    },
    category: businessCategory.treasuryBounties,
  },
  "child-bounties": {
    api: {
      path: "overview/child-bounties",
    },
    formatter(data) {
      return normalizeBountyListItem(CHAIN, data);
    },
    category: businessCategory.treasuryChildBounties,
  },
  tips: {
    api: {
      path: "overview/tips",
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
    ?.filter((item) => item.activeCount)
    ?.filter((item) => !item.excludeToChains?.includes(CHAIN))
    ?.map((item) => {
      const options = itemOptions[item.value];

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
    });

  return {
    ...menu,
    items,
  };
}
