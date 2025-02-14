import { useContextDemotionExpirationCount } from "../context/demotionExpirationCount";
import { useContextMyApproveReferenda } from "../context/myApproveReferenda";
import { useContextMyDemotionExpiration } from "../context/myDemotionExpiration";
import { useContextMyEvidence } from "../context/myEvidence";

function useMyDemotionTodoLoading() {
  const { isLoading: isMyDemotionExpirationLoading } =
    useContextMyDemotionExpiration();
  const { isLoading: isMyEvidenceLoading } = useContextMyEvidence();
  return isMyDemotionExpirationLoading || isMyEvidenceLoading;
}

function useMyDemotionExpirationTodoLoading() {
  const { isLoading } = useContextDemotionExpirationCount();
  return isLoading;
}

function useRetentionReferendaTodoForLowerRankLoading() {
  const { isLoading: isMyDemotionExpirationLoading } =
    useContextMyDemotionExpiration();
  const { isLoading: isMyEvidenceLoading } = useContextMyEvidence();
  const { isLoading: isMyApproveReferendaLoading } =
    useContextMyApproveReferenda();
  return (
    isMyDemotionExpirationLoading ||
    isMyEvidenceLoading ||
    isMyApproveReferendaLoading
  );
}

export default function useTodoListLoading() {
  const isMyDemotionTodoLoading = useMyDemotionTodoLoading();
  const isMyDemotionExpirationTodoLoading =
    useMyDemotionExpirationTodoLoading();
  const isRetentionReferendaTodoForLowerRankLoading =
    useRetentionReferendaTodoForLowerRankLoading();
  return (
    isMyDemotionTodoLoading ||
    isMyDemotionExpirationTodoLoading ||
    isRetentionReferendaTodoForLowerRankLoading
  );
}
