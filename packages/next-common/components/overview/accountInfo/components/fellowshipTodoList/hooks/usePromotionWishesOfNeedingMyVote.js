import useCollectiveMember from "next-common/utils/hooks/collectives/useCollectiveMembers";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function usePromotionWishesOfNeedingMyVote(promotionEvidences) {
  const realAddress = useRealAddress();
  const me = useCollectiveMember(realAddress);
  const myRank = me?.rank;

  if (!myRank || myRank < 3) {
    return [];
  }
  /**
  TODO: 
  Here you need to dynamically display the number of candidates promotion evidences
  that the current user needs to vote for 
  calculated in real time based on user identity and permissions
  */

  return promotionEvidences;
}
