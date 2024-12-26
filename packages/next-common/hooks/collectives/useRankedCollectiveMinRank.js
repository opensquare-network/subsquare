// used on ranked collective referendum detail page
import { useTrack } from "next-common/context/post/gov2/track";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { getMinRankOfClass } from "next-common/context/post/fellowship/useMaxVoters";

export default function useRankedCollectiveMinRank() {
  const { id: trackId } = useTrack();
  const collectivePallet = useRankedCollectivePallet();
  return getMinRankOfClass(trackId, collectivePallet);
}
