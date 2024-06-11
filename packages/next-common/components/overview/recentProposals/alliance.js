import { getAllianceMenu, Names } from "next-common/utils/consts/menu/alliance";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
  getVoteSummaryColumnPlaceholder,
} from "./columns";
import normalizeAllianceMotion from "next-common/utils/viewfuncs/alliance/allianceMotion";
import normalizeAllianceAnnouncement from "next-common/utils/viewfuncs/alliance/allianceAnnouncement";
import businessCategory from "next-common/utils/consts/business/category";
import { overviewApi } from "next-common/services/url";
import { usePageProps } from "next-common/context/page";

const itemOptions = {
  allianceMotions: {
    api: {
      path: overviewApi.allianceMotions,
    },
    formatter: normalizeAllianceMotion,
    category: businessCategory.allianceMotions,
  },
  allianceAnnouncements: {
    api: {
      path: overviewApi.allianceAnnouncements,
    },
    formatter: normalizeAllianceAnnouncement,
    category: businessCategory.allianceAnnouncements,
  },
};

export function useRecentProposalAlliance() {
  const { overviewSummary, summary, recentProposals } = usePageProps();

  const menu = getAllianceMenu(summary);

  const items = menu.items
    .map((item) => {
      if (
        item.value === "allianceMotions" &&
        !overviewSummary?.allianceMotions?.active
      ) {
        return;
      }
      if (
        item.value === "allianceAnnouncements" &&
        !overviewSummary?.allianceAnnouncements?.active
      ) {
        return;
      }

      const options = itemOptions[item.value];

      if (options) {
        return {
          ...item,
          ...options,
          api: {
            ...options?.api,
            initData: recentProposals[Names.alliance]?.[item.value],
          },
          columns: [
            getProposalPostTitleColumn(),
            { className: "w-40" },
            getVoteSummaryColumnPlaceholder(),
            getStatusTagColumn({ category: options?.category }),
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
