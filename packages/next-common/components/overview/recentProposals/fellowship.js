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

const fellowshipTooltipContent = {
  1: "Origin aggregated through weighted votes of those with rank 1 or above; `Success` is 1. Aka the \"voice\" of all Members.",
  2: "Origin aggregated through weighted votes of those with rank 2 or above; `Success` is 2. Aka the \"voice\" of members at least II Dan.",
  3: "Origin aggregated through weighted votes of those with rank 3 or above; `Success` is 3. Aka the \"voice\" of all Fellows.",
  4: "Origin aggregated through weighted votes of those with rank 4 or above; `Success` is 4. Aka the \"voice\" of members at least IV Dan.",
  5: "Origin aggregated through weighted votes of those with rank 5 or above; `Success` is 5. Aka the \"voice\" of members at least V Dan.",
  6: "Origin aggregated through weighted votes of those with rank 6 or above; `Success` is 6. Aka the \"voice\" of members at least VI Dan.",
  7: "Origin aggregated through weighted votes of those with rank 7 or above; `Success` is 7. Aka the \"voice\" of all Masters.",
  8: "Origin aggregated through weighted votes of those with rank 8 or above; `Success` is 8. Aka the \"voice\" of members at least VIII Dan.",
  9: "Origin aggregated through weighted votes of those with rank 9 or above; `Success` is 9. Aka the \"voice\" of members at least IX Dan.",
  11: "Origin aggregated through weighted votes of those with rank 3 or above when voting on a fortnight-long track; `Success` is 1.",
  12: "Origin aggregated through weighted votes of those with rank 4 or above when voting on a fortnight-long track; `Success` is 2",
  13: "Origin aggregated through weighted votes of those with rank 5 or above when voting on a fortnight-long track; `Success` is 3.",
  14: "Origin aggregated through weighted votes of those with rank 6 or above when voting on a fortnight-long track; `Success` is 4.",
  15: "Origin aggregated through weighted votes of those with rank 7 or above when voting on a fortnight-long track; `Success` is 5.",
  16: "Origin aggregated through weighted votes of those with rank 8 or above when voting on a fortnight-long track; `Success` is 6.",
  21: "Origin aggregated through weighted votes of those with rank 3 or above when voting on a month-long track; `Success` is 1",
  22: "Origin aggregated through weighted votes of those with rank 4 or above when voting on a month-long track; `Success` is 2.",
  23: "Origin aggregated through weighted votes of those with rank 5 or above when voting on a month-long track; `Success` is 3.",
  24: "Origin aggregated through weighted votes of those with rank 6 or above when voting on a month-long track; `Success` is 4.",
  25: "Origin aggregated through weighted votes of those with rank 7 or above when voting on a month-long track; `Success` is 5.",
  26: "Origin aggregated through weighted votes of those with rank 8 or above when voting on a month-long track; `Success` is 6.",
  31: "Origin aggregated through weighted votes of those with rank 3 or above when voting on a 30 day long track; `Success` is 1.",
  32: "Origin aggregated through weighted votes of those with rank 4 or above when voting on a 30 day long track; `Success` is 2.",
  33: "Origin aggregated through weighted votes of those with rank 5 or above when voting on a 30 day long track; `Success` is 3.",
};

export function useRecentProposalFellowship() {
  const { recentSummary, recentProposals } = usePageProps();
  const fellowshipTracks = recentSummary?.fellowshipReferendaTracks;

  const menu = getFellowshipMenu(recentSummary);
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
      tooltip: fellowshipTooltipContent[item.value],
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
