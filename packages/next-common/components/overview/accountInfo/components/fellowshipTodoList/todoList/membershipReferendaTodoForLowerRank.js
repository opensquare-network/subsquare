import TodoTag from "./todoTag";
import ClickableText from "./clickableText";
import { useContextMyEvidence } from "../context/myEvidence";
import { useMemo, useState } from "react";
import { EvidenceDetailPopup } from "next-common/components/collectives/core/member/evidence";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useShouldShowMembershipReferendaTodoForLowerRank from "../hooks/useShouldShowMembershipReferendaTodoForLowerRank";
import UserListPopup from "./userListPopup";
import useCoreMembersWithRank from "next-common/components/collectives/core/useCoreMembersWithRank";
import useContextMyMember from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/hooks/mine";

function useEligibleMembers() {
  const { members, isLoading } = useCoreMembersWithRank();
  const eligibleMembers = useMemo(() => {
    const eligibleMembers = members.filter((member) => member.rank >= 3);
    eligibleMembers.sort((a, b) => b.rank - a.rank);
    return eligibleMembers;
  }, [members]);
  return { eligibleMembers, isLoading };
}

function EvidencePopup({ onClose }) {
  const address = useRealAddress();
  const { evidence } = useContextMyEvidence();
  const member = useContextMyMember();
  const { rank, status: { isActive } = {} } = member || {};

  const [wish, evidenceData] = evidence.toJSON();

  return (
    <EvidenceDetailPopup
      address={address}
      rank={rank}
      isActive={isActive}
      wish={wish}
      evidence={evidenceData}
      onClose={onClose}
    />
  );
}

function EligibleMemberPopup({ onClose }) {
  const { eligibleMembers, isLoading } = useEligibleMembers();
  return (
    <UserListPopup
      users={eligibleMembers}
      isLoading={isLoading}
      onClose={onClose}
    />
  );
}

export default function MembershipReferendaTodoForLowerRank() {
  const [showEvidenceDetailPopup, setShowEvidenceDetailPopup] = useState(false);
  const [showEligibleMembersPopup, setShowEligibleMembersPopup] =
    useState(false);
  const show = useShouldShowMembershipReferendaTodoForLowerRank();
  if (!show) {
    return null;
  }

  return (
    <>
      <div className="flex items-center">
        <TodoTag>Membership</TodoTag>
        <div className="text-textPrimary text14Medium">
          You have an on-chain &nbsp;
          <ClickableText onClick={() => setShowEvidenceDetailPopup(true)}>
            evidence
          </ClickableText>{" "}
          &nbsp; with no referenda and you can contact{" "}
          <ClickableText onClick={() => setShowEligibleMembersPopup(true)}>
            eligible members
          </ClickableText>
          &nbsp; to handle it.
        </div>
      </div>
      {showEvidenceDetailPopup && (
        <EvidencePopup onClose={() => setShowEvidenceDetailPopup(false)} />
      )}
      {showEligibleMembersPopup && (
        <EligibleMemberPopup
          onClose={() => setShowEligibleMembersPopup(false)}
        />
      )}
    </>
  );
}
