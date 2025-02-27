import { useContextMyMembershipReferenda } from "../context/myMembershipReferenda";
import { useContextMyEvidence } from "../context/hooks/evidence";
import { useContextMyCoreMember } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/hooks/mine";

export default function useHasMemberReferendaTodo() {
  const { evidence } = useContextMyEvidence();
  const { myMembershipReferenda } = useContextMyMembershipReferenda();
  const member = useContextMyCoreMember();
  const { rank } = member;

  if (!evidence) {
    return false;
  }

  const noMembershipReferenda = !myMembershipReferenda?.length;
  const canNotCreateReferenda = rank < 3;

  return noMembershipReferenda && canNotCreateReferenda;
}
