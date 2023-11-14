import { CHAIN } from "next-common/utils/constants";
import { getAllianceMenu, Names } from "next-common/utils/consts/menu/alliance";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "./columns/common";
import normalizeAllianceMotion from "next-common/utils/viewfuncs/alliance/allianceMotion";
import normalizeAllianceAnnouncement from "next-common/utils/viewfuncs/alliance/allianceAnnouncement";
import businessCategory from "next-common/utils/consts/business/category";

const itemOptions = {
  allianceMotions: {
    api: {
      path: "overview/alliance-motions",
    },
    formatter: normalizeAllianceMotion,
    category: businessCategory.allianceMotions,
  },
  allianceAnnouncements: {
    api: {
      path: "overview/alliance-announcements",
    },
    formatter: normalizeAllianceAnnouncement,
    category: businessCategory.allianceAnnouncements,
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
        columns: [
          getProposalPostTitleColumn(),
          getStatusTagColumn({ category: options.category }),
        ],
      };
    });

  return {
    ...menu,
    items,
  };
}
