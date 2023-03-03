import { getGov2ReferendumTitle } from "../title";
import { getPostLastActivityAt } from "../../viewfuncs/postUpdatedTime";
import { fellowshipBaseUrl } from "../../postBaseUrl";

export default function normalizeFellowshipReferendaListItem(
  item,
  tracks = []
) {
  const track = tracks.find(
    (trackItem) => trackItem.id === item.onchainData.track,
  );

  return {
    ...item,
    title: getGov2ReferendumTitle(item),
    time: getPostLastActivityAt(item),
    status: item.onchainData?.state?.name ?? "Unknown",
    index: item.referendumIndex,
    address: item.proposer,
    detailLink: `${fellowshipBaseUrl}/${item.referendumIndex}`,
    commentsCount: item.commentsCount,
    trackName: track?.name || item.trackInfo?.name,
  };
}
