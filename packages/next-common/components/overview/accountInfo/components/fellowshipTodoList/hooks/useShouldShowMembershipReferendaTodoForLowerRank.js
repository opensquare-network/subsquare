import { useContextMyMembershipReferenda } from "../context/myMembershipReferenda";
import { useContextMyEvidence } from "../context/myEvidence";
import useContextMyMember from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/hooks/mine";

export default function useShouldShowMembershipReferendaTodoForLowerRank() {
  const { evidence } = useContextMyEvidence();
  const { myMembershipReferenda } = useContextMyMembershipReferenda();
  const member = useContextMyMember();
  const { rank } = member;

  if (!evidence || evidence.isNone) {
    return false;
  }

  const noMembershipReferenda = !myMembershipReferenda?.length;
  const canNotCreateReferenda = rank < 3;

  return noMembershipReferenda && canNotCreateReferenda;
}
