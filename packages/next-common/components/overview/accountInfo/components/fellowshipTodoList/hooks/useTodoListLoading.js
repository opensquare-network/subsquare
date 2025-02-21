import { useContextMyMembershipReferenda } from "../context/myMembershipReferenda";
import { useContextMyEvidence } from "../context/myEvidence";
import { useContextCoreParams } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreParams";
import { useContext } from "react";
import { CoreMembersContext } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreMembers";

export default function useTodoListLoading() {
  const { isLoading: isMyEvidenceLoading } = useContextMyEvidence();
  const { isLoading: isMyMembershipReferendaLoading } =
    useContextMyMembershipReferenda();
  const { isLoading: isLoadingCoreParams } = useContextCoreParams();
  const { isLoading: isLoadingMembers } = useContext(CoreMembersContext);

  return (
    isMyEvidenceLoading ||
    isMyMembershipReferendaLoading ||
    isLoadingCoreParams ||
    isLoadingMembers
  );
}
