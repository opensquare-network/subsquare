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
import { useChainSettings } from "next-common/context/chain";

export function useRecentProposalReferenda() {
  const { recentProposals, tracks, overviewSummary } = usePageProps();
  const {
    modules: { referenda: hasReferenda },
  } = useChainSettings();

  if (!hasReferenda) {
    return null;
  }

  if (!overviewSummary?.gov2Referenda?.active) {
    return null;
  }

  // Find out tracks that have recent active referenda
  const recentActiveTracks = tracks.filter((track) =>
    overviewSummary.gov2ReferendaTracks.find(
      (recentTrack) =>
        recentTrack.id === track.id && recentTrack.activeCount > 0,
    ),
  );

  const menu = getReferendaMenu(recentActiveTracks);

  const items = menu.items
    ?.map((item) => {
      const track = item.value;

      if (track !== "all" && isNaN(track)) {
        return null;
      }

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
    })
    .filter(Boolean);

  return {
    ...menu,
    items,
  };
}
