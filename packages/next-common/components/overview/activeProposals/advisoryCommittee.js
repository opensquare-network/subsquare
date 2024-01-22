import {
  getAdvisoryCommitteeMenu,
  Names,
} from "next-common/utils/consts/menu/advisoryCouncil";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
  getVoteSummaryColumnPlaceholder,
} from "./columns";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";
import { toAdvisoryMotionsListItem } from "next-common/utils/viewfuncs";

const itemOptions = {
  advisoryMotions: {
    api: {
      path: overviewApi.advisoryMotions,
    },
    formatter: toAdvisoryMotionsListItem,
  },
};

export function getActiveProposalAdvisoryCommittee({
  summary,
  activeProposals,
}) {
  const menu = getAdvisoryCommitteeMenu(summary);

  const items = menu.items
    .map((item) => {
      const options = itemOptions[item.value];

      if (options) {
        return {
          ...item,
          ...options,
          api: {
            ...options.api,
            initData: activeProposals[Names.advisoryCommittee]?.[item.value],
          },
          columns: [
            getProposalPostTitleColumn(),
            { className: "w-40" },
            getVoteSummaryColumnPlaceholder(),
            getStatusTagColumn({ category: businessCategory.advisoryMotions }),
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
