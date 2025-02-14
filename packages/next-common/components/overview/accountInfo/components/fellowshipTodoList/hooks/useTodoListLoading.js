import { useContextDemotionExpirationCount } from "../context/demotionExpirationCount";
import { useContextMyEvidence } from "../context/myEvidence";
import { useContextMyMemberData } from "../context/myMemberDataProvider";

function useMyDemotionTodoLoading() {
  const { isLoading: isMyMemberDataLoading } = useContextMyMemberData();
  const { isLoading: isMyEvidenceLoading } = useContextMyEvidence();
  return isMyMemberDataLoading || isMyEvidenceLoading;
}

function useMyDemotionExpirationTodoLoading() {
  const { isLoading } = useContextDemotionExpirationCount();
  return isLoading;
}

export default function useTodoListLoading() {
  const isMyDemotionTodoLoading = useMyDemotionTodoLoading();
  const isMyDemotionExpirationTodoLoading =
    useMyDemotionExpirationTodoLoading();
  return isMyDemotionTodoLoading || isMyDemotionExpirationTodoLoading;
}
