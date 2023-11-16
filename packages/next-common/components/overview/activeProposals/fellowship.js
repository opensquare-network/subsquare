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

export function getActiveProposalFellowship({
  fellowshipTracks,
  activeProposals,
}) {
  const menu = getFellowshipMenu(fellowshipTracks);

  const items = menu.items?.map((item) => {
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
      api.initData = activeProposals.fellowship;
    }

    return {
      ...item,
      api,
      formatter: (data) =>
        normalizeFellowshipReferendaListItem(data, fellowshipTracks),
      columns: [
        getReferendumPostTitleColumn(),
        track === "all" && getTrackColumn({ hrefPrefix: "/fellowship/tracks" }),
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
