import { useContextMyMembershipReferenda } from "../context/myMembershipReferenda";
import { useContextMyEvidence } from "../context/myEvidence";
import { useContextCoreParams } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreParams";
import { useContextMyMemberData } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/myMemberData";

export default function useTodoListLoading() {
  const { isLoading: isMyEvidenceLoading } = useContextMyEvidence();
  const { isLoading: isLoadingMyMemberData } = useContextMyMemberData();
  const { isLoading: isMyMembershipReferendaLoading } =
    useContextMyMembershipReferenda();
  const { isLoading: isLoadingCoreParams } = useContextCoreParams();

  return (
    isMyEvidenceLoading ||
    isLoadingMyMemberData ||
    isMyMembershipReferendaLoading ||
    isLoadingCoreParams
  );
}
