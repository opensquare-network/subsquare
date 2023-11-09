import businessCategory from "next-common/utils/consts/business/category";
import {
  getReferendumPostTitleColumn,
  getRequestColumn,
  getStatusTagColumn,
  getTrackColumn,
  getVoteSummaryColumn,
} from "./common";
import normalizeFellowshipReferendaListItem from "next-common/utils/gov2/list/normalizeFellowshipReferendaListItem";
import { getFellowshipMenu } from "next-common/utils/consts/menu/fellowship";

function getColumns(item) {
  const track = item.value;

  return [
    getReferendumPostTitleColumn(),
    track === "all" && getTrackColumn({ hrefPrefix: "/fellowship/tracks" }),
    track !== "all" && track !== 0 && getRequestColumn(),
    getVoteSummaryColumn({ type: businessCategory.fellowship }),
    getStatusTagColumn({ category: businessCategory.fellowship }),
  ].filter(Boolean);
}

export function getActiveProposalFellowship({
  fellowshipTracks,
  activeProposals,
}) {
  const menu = getFellowshipMenu(fellowshipTracks);

  const items = menu.items?.map((item) => {
    const track = item.value;

    const api = {
      path: "overview/fellowship",
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
      columns: getColumns(item),
    };
  });

  return {
    ...menu,
    items,
  };
}
