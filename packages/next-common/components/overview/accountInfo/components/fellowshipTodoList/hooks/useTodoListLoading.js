import { useContextDemotionExpirationCount } from "../context/demotionExpirationCount";
import { useContextMyMembershipReferenda } from "../context/myMembershipReferenda";
import { useContextMyDemotionExpiration } from "../context/myDemotionExpiration";
import { useContextMyEvidence } from "../context/myEvidence";
import { useContextCoreParams } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreParams";

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

function useMembershipReferendaTodoForLowerRankLoading() {
  const { isLoading: isMyDemotionExpirationLoading } =
    useContextMyDemotionExpiration();
  const { isLoading: isMyEvidenceLoading } = useContextMyEvidence();
  const { isLoading: isMyMembershipReferendaLoading } =
    useContextMyMembershipReferenda();
  return (
    isMyDemotionExpirationLoading ||
    isMyEvidenceLoading ||
    isMyMembershipReferendaLoading
  );
}

export default function useTodoListLoading() {
  const isMyDemotionTodoLoading = useMyDemotionTodoLoading();
  const isMyDemotionExpirationTodoLoading =
    useMyDemotionExpirationTodoLoading();
  const isMembershipReferendaTodoForLowerRankLoading =
    useMembershipReferendaTodoForLowerRankLoading();
  const { isLoading: isLoadingCoreParams } = useContextCoreParams();

  return (
    isMyDemotionTodoLoading ||
    isMyDemotionExpirationTodoLoading ||
    isMembershipReferendaTodoForLowerRankLoading ||
    isLoadingCoreParams
  );
}
