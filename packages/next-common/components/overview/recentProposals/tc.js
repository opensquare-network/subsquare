import { CHAIN } from "next-common/utils/constants";
import { getTechCommMenu, Names } from "next-common/utils/consts/menu/tc";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
  getVoteSummaryColumnPlaceholder,
} from "./columns";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeTechCommMotionListItem from "next-common/utils/viewfuncs/collective/normalizeTechCommMotionListItem";
import { overviewApi } from "next-common/services/url";
import { usePageProps } from "next-common/context/page";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";

const itemOptions = {
  techCommProposals: {
    api: {
      path: overviewApi.tcMotions,
    },
    formatter: (data) => normalizeTechCommMotionListItem(CHAIN, data),
    category: businessCategory.tcProposals,
  },
};

export function useRecentProposalTechComm() {
  const { overviewSummary, summary, recentProposals } = usePageProps();

  const chain = useChain();
  if (chain === Chains.polkadot) {
    return null;
  }

  const menu = getTechCommMenu(summary);

  const items = menu.items
    .map((item) => {
      if (
        item.value === "techCommProposals" &&
        !overviewSummary?.techCommMotions?.active
      ) {
        return;
      }

      const options = itemOptions[item.value];

      if (options) {
        return {
          ...item,
          ...options,
          api: {
            ...options.api,
            initData: recentProposals[Names.techComm]?.[item.value],
          },
          columns: [
            getProposalPostTitleColumn(),
            { className: "w-40" },
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
