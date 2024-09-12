import businessCategory from "next-common/utils/consts/business/category";
import {
  getReferendumPostTitleColumn,
  getStatusTagColumn,
  getTrackColumn,
  getVoteSummaryColumn,
} from "./columns";
import normalizeFellowshipReferendaListItem from "next-common/utils/gov2/list/normalizeFellowshipReferendaListItem";
import { getFellowshipMenu } from "next-common/utils/consts/menu/fellowship";
import { overviewApi } from "next-common/services/url";
import { usePageProps } from "next-common/context/page";
import { find } from "lodash-es";

export function useRecentProposalFellowship() {
  const { overviewSummary, recentProposals } = usePageProps();
  const fellowshipTracks = overviewSummary?.fellowshipReferendaTracks;

  const menu = getFellowshipMenu(overviewSummary);
  const referendaMenu = find(menu.items, { value: "fellowship-referenda" });

  const items = referendaMenu.items?.map((item) => {
    const track = item.value;

    const api = {
      path: overviewApi.fellowship,
      params: {},
      // data from server side for SSR
      initData: null,
    };

    if (track !== "all") {
      api.params.track = track;
    }
    if (track === "all") {
      api.initData = recentProposals.fellowship;
    }

    const trackColumn = getTrackColumn({ hrefPrefix: "/fellowship/tracks" });

    return {
      ...item,
      api,
      formatter: (data) =>
        normalizeFellowshipReferendaListItem(data, fellowshipTracks),
      columns: [
        getReferendumPostTitleColumn(),
        track === "all" ? trackColumn : { className: trackColumn.className },
        getVoteSummaryColumn({ type: businessCategory.fellowship }),
        getStatusTagColumn({ category: businessCategory.fellowship }),
      ].filter(Boolean),
    };
  });

  return {
    ...menu,
    items,
  };
}
