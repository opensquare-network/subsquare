import { CHAIN } from "next-common/utils/constants";
import { getAllianceMenu, Names } from "next-common/utils/consts/menu/alliance";

const itemOptions = {
  [Names.allianceMotions]: {
    api: {
      path: "overview/alliance-motions",
    },
  },
  [Names.allianceAnnouncements]: {
    api: {
      path: "overview/alliance-announcements",
    },
  },
};

export function getActiveProposalAlliance({ summary, activeProposals }) {
  const menu = getAllianceMenu(summary);

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
          initData: activeProposals[Names.alliance]?.[item.value],
        },
      };
    });

  return {
    ...menu,
    items,
  };
}
