import { useContextMyApproveReferenda } from "../context/myApproveReferenda";
import { useContextMyDemotionExpiration } from "../context/myDemotionExpiration";
import { useContextMyEvidence } from "../context/myEvidence";
import { useContextMyRank } from "../context/myMemberData";

export default function useShouldShowRetentionReferendaTodoForLowerRank() {
  const { isDemotionExpiring } = useContextMyDemotionExpiration();
  const { evidence } = useContextMyEvidence();
  const { myApproveReferenda } = useContextMyApproveReferenda();
  const myRank = useContextMyRank();

  if (!isDemotionExpiring || !evidence) {
    return false;
  }

  const data = evidence.toJSON();
  if (!data) {
    return false;
  }

  const [wish] = data;
  const hasRetentionEvidence = wish?.toLowerCase() === "retention";
  const noApproveReferenda = !myApproveReferenda?.length;
  const canCreateReferenda = myRank < 3;

  return hasRetentionEvidence && noApproveReferenda && !canCreateReferenda;
}
