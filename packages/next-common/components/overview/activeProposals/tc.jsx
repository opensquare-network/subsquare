import { CHAIN } from "next-common/utils/constants";
import { getTechCommMenu } from "next-common/utils/consts/menu/tc";

const itemOptions = {
  Proposals: {
    api: {
      path: "overview/tc-motions",
    },
  },
};

export function getActiveProposalsTechComm({ summary, activeProposals }) {
  const menu = getTechCommMenu(summary);

  const items = menu.items
    ?.filter((item) => item.activeCount)
    ?.filter((item) => !item.excludeToChains?.includes(CHAIN))
    .map((item) => {
      const options = itemOptions[item.value];
      console.log(activeProposals.technicalCommittee?.[item.value]);

      return {
        ...item,
        ...options,
        api: {
          ...options.api,
          initData: activeProposals.technicalCommittee?.[item.value],
        },
      };
    });

  return {
    ...menu,
    items,
  };
}
