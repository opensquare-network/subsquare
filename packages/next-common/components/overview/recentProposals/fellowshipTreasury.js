import { CHAIN } from "next-common/utils/constants";
import {
  getProposalPostTitleColumn,
  getRequestColumn,
  getSpendRequestColumn,
  getStatusTagColumn,
  getVoteSummaryColumnPlaceholder,
} from "./columns";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";
import { usePageProps } from "next-common/context/page";
import { normalizeFellowshipTreasurySpendListItem } from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";
import { MenuTreasury } from "@osn/icons/subsquare";

const itemOptions = {
  spends: {
    api: {
      path: overviewApi.fellowshipTreasurySpends,
    },
    formatter(data) {
      return normalizeFellowshipTreasurySpendListItem(CHAIN, data);
    },
    category: businessCategory.fellowshipTreasurySpends,
  },
};

export function useRecentProposalFellowshipTreasury() {
  const { overviewSummary, recentProposals } = usePageProps();
  const summary = overviewSummary;
  const activeTreasurySpends = summary?.fellowshipTreasurySpends?.active || 0;

  const menu = {
    name: "Fellowship Treasury",
    icon: <MenuTreasury />,
    pathname: "/treasury",
    activeCount: activeTreasurySpends,
    items: [
      {
        value: "spends",
        name: "Spends",
        pathname: "/fellowship/treasury/spends",
        extraMatchNavMenuActivePathnames: ["/fellowship/treasury/spends/[id]"],
        activeCount: activeTreasurySpends,
      },
    ],
  };

  const items = menu.items
    ?.map((item) => {
      const options = itemOptions[item.value];

      let requestColumn = getRequestColumn();
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
