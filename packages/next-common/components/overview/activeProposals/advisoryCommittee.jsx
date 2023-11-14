import { CHAIN } from "next-common/utils/constants";
import {
  getAdvisoryCommitteeMenu,
  Names,
} from "next-common/utils/consts/menu/advisoryCouncil";

const itemOptions = {
  [Names.advisoryMotions]: {
    api: {
      path: "overview/advisory-motions",
    },
  },
};

export function getActiveProposalAdvisoryCommittee({
  summary,
  activeProposals,
}) {
  const menu = getAdvisoryCommitteeMenu(summary);

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
          initData: activeProposals[Names.advisoryMotions]?.[item.value],
        },
      };
    });

  return {
    ...menu,
    items,
  };
}
