import { getReferendaMenu } from "next-common/utils/consts/menu/referenda";
import normalizeGov2ReferendaListItem from "next-common/utils/gov2/list/normalizeReferendaListItem";
import businessCategory from "next-common/utils/consts/business/category";
import {
  getReferendumPostTitleColumn,
  getRequestColumn,
  getStatusTagColumn,
  getTrackColumn,
  getVoteSummaryColumn,
} from "./columns";
import { overviewApi } from "next-common/services/url";
import { usePageProps } from "next-common/context/page";

export function useRecentProposalReferenda() {
  const { recentSummary, recentProposals } = usePageProps();
  const tracks = recentSummary?.gov2ReferendaTracks;

  const menu = getReferendaMenu(tracks);

  const items = menu.items?.map((item) => {
    const track = item.value;

    const api = {
      path: overviewApi.referenda,
      params: {},
      // data from server side for SSR
      initData: null,
    };

    if (track !== "all") {
      api.params.track = track;
    }
    if (track === "all") {
      api.initData = recentProposals.referenda;
    }

    const trackColumn = getTrackColumn({ hrefPrefix: "/referenda/tracks" });

    return {
      ...item,
      api,
      formatter: (data) => normalizeGov2ReferendaListItem(data, tracks),
      columns: [
        getReferendumPostTitleColumn(),
        track === "all" && trackColumn,
        track !== "all" && track !== 0 && getRequestColumn(),
        getVoteSummaryColumn({ type: businessCategory.openGovReferenda }),
        getStatusTagColumn({ category: businessCategory.openGovReferenda }),
      ].filter(Boolean),
    };
  });

  return {
    ...menu,
    items,
  };
}
