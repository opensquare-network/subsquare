import { getGov2ReferendumTitle } from "../title";
import { getPostLastActivityAt } from "../../viewfuncs/postUpdatedTime";
import { referendaReferendumBaseUrl } from "../../postBaseUrl";

export default function normalizeGov2ReferendaListItem(item, tracks = []) {
  const track = tracks.find(
    (trackItem) => trackItem.id === item.onchainData?.track,
  );

  return {
    ...item,
    title: getGov2ReferendumTitle(item),
    time: getPostLastActivityAt(item),
    status: item.onchainData?.state?.name ?? "Unknown",
    index: item.referendumIndex,
    address: item.proposer,
    detailLink: item.sima
      ? `/sima${referendaReferendumBaseUrl}/${item.referendumIndex}`
      : `${referendaReferendumBaseUrl}/${item.referendumIndex}`,
    commentsCount: item.commentsCount,
    trackName: track?.name || item.trackInfo?.name,
  };
}
