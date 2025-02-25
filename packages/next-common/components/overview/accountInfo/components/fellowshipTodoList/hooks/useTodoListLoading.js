import { useContextMyMembershipReferenda } from "../context/myMembershipReferenda";
import { useContextMyEvidence } from "../context/myEvidence";
import { useContextCoreParams } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreParams";
import { useContext } from "react";
import { CoreMembersContext } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreMembers";
import { useContextCollectivesMembers } from "../context/collectivesMember";
import { useContextMySalaryClaimant } from "../context/mySalaryClaimant";
import { useContextSalaryStats } from "../context/salaryStats";
import { useContextCollectivesReferendaVotes } from "../context/collectivesVotes";
import { useAllMemberEvidenceContext } from "next-common/components/collectives/core/context/evidenceMemberContext";

export default function useTodoListLoading() {
  const { isLoading: isMyEvidenceLoading } = useContextMyEvidence();
  const { isLoading: isMyMembershipReferendaLoading } =
    useContextMyMembershipReferenda();
  const { isLoading: isLoadingCoreParams } = useContextCoreParams();
  const { isLoading: isLoadingCoreMembers } = useContext(CoreMembersContext);
  const { isLoading: isLoadingCollectivesMembers } =
    useContextCollectivesMembers();
  const { isLoading: isLoadingClaimant } = useContextMySalaryClaimant();
  const { isLoading: isLoadingCollectivesVotes } =
    useContextCollectivesReferendaVotes();
  const { isLoading: isLoadingAllMemberEvidence } =
    useAllMemberEvidenceContext();
  const salaryStats = useContextSalaryStats();

  return (
    isMyEvidenceLoading ||
    isMyMembershipReferendaLoading ||
    isLoadingCoreParams ||
    isLoadingCoreMembers ||
    isLoadingCollectivesMembers ||
    isLoadingClaimant ||
    isLoadingCollectivesVotes ||
    isLoadingAllMemberEvidence ||
    !salaryStats
  );
}
