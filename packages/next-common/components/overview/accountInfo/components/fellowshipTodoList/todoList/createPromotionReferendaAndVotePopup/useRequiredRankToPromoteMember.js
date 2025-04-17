import {
  getMinRankOfClass,
  getTrackToFastPromoteToRank,
  getTrackToPromoteToRank,
} from "next-common/context/post/fellowship/useMaxVoters";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";

export default function useRequiredRankToPromoteMember(fromRank, toRank) {
  const collectivePallet = useRankedCollectivePallet();
  let trackId = getTrackToPromoteToRank(toRank);
  if (toRank - fromRank > 1) {
    trackId = getTrackToFastPromoteToRank(toRank);
  }
  return getMinRankOfClass(trackId, collectivePallet);
}
