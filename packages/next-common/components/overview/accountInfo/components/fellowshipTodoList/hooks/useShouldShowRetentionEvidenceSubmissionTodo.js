import { useContextMyDemotionExpiration } from "../context/myDemotionExpirationProvider";
import { useContextMyEvidence } from "../context/myEvidence";

export function useShouldShowRetentionEvidenceSubmissionTodo() {
  const { isDemotionExpiring } = useContextMyDemotionExpiration();
  const { evidence } = useContextMyEvidence();
  return isDemotionExpiring && (!evidence || !evidence.toJSON());
}
