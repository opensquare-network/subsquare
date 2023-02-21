import { getGov2ReferendumTitle } from "../title";
import { getPostLastActivityAt } from "../../viewfuncs/postUpdatedTime";

export default function normalizeFellowshipReferendaListItem(item, tracks = []) {
  const track = tracks.find(
    (trackItem) => trackItem.id === item.onchainData.track
  );

  return {
    ...item,
    title: getGov2ReferendumTitle(item),
    time: getPostLastActivityAt(item),
    status: item.onchainData?.state?.name ?? "Unknown",
    index: item.referendumIndex,
    author: item.author,
    address: item.proposer,
    detailLink: `/fellowship/referendum/${ item.referendumIndex }`,
    commentsCount: item.commentsCount,
    trackName: track?.name || item.trackInfo?.name,
  };
};
