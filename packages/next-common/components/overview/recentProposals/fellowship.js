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
import { useChainSettings } from "next-common/context/chain";

export function useRecentProposalFellowship() {
  const { recentProposals, fellowshipTracks, overviewSummary } = usePageProps();
  const {
    modules: { fellowship: hasFellowship },
  } = useChainSettings();

  if (!hasFellowship) {
    return null;
  }

  if (!overviewSummary?.fellowshipReferenda?.active) {
    return null;
  }

  // Find out tracks that have recent active referenda
  const recentActiveTracks = fellowshipTracks.filter((track) =>
    overviewSummary?.fellowshipReferendaTracks?.find(
      (recentTrack) =>
        recentTrack.id === track.id && recentTrack.activeCount > 0,
    ),
  );

  const menu = getFellowshipMenu(recentActiveTracks);

  const items = menu.items
    ?.map((item) => {
      const track = item.value;

      if (track !== "all" && isNaN(track)) {
        return null;
      }

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
    })
    .filter(Boolean);

  return {
    ...menu,
    items,
  };
}
