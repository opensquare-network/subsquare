import { useContextMyMembershipReferenda } from "../context/myMembershipReferenda";
import { useContextMyDemotionExpiration } from "../context/myDemotionExpiration";
import { useContextMyEvidence } from "../context/myEvidence";
import { useContextMyRank } from "../context/myMemberData";

export default function useShouldShowMembershipReferendaTodoForLowerRank() {
  const { isDemotionExpiring } = useContextMyDemotionExpiration();
  const { evidence } = useContextMyEvidence();
  const { myMembershipReferenda } = useContextMyMembershipReferenda();
  const myRank = useContextMyRank();

  if (!isDemotionExpiring || !evidence) {
    return false;
  }

  const data = evidence.toJSON();
  if (!data) {
    return false;
  }

  const noMembershipReferenda = !myMembershipReferenda?.length;
  const canNotCreateReferenda = myRank < 3;

  return noMembershipReferenda && canNotCreateReferenda;
}
