import { useContextMyEvidence } from "../context/myEvidence";
import { useContextMyMemberData } from "../context/myMemberDataProvider";

export default function useMyDemotionTodoLoading() {
  const { isLoading: isMyMemberDataLoading } = useContextMyMemberData();
  const { isLoading: isMyEvidenceLoading } = useContextMyEvidence();
  return isMyMemberDataLoading || isMyEvidenceLoading;
}
