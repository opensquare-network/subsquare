import TodoTag from "./todoTag";
import ClickableText from "./clickableText";
import { useContextMyEvidence } from "../context/myEvidence";
import { useMemo, useState } from "react";
import { EvidenceDetailPopup } from "next-common/components/collectives/core/member/evidence";
import { useContextMyMemberData } from "../context/myMemberData";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useShouldShowMembershipReferendaTodoForLowerRank from "../hooks/useShouldShowMembershipReferendaTodoForLowerRank";
import UserListPopup from "./userListPopup";
import useCoreMembersWithRank from "next-common/components/collectives/core/useCoreMembersWithRank";

function useEligibleMembers() {
  const { members, isLoading } = useCoreMembersWithRank();
  const eligibleMembers = useMemo(() => {
    return members.filter((member) => member.rank >= 3);
  }, [members]);
  return { eligibleMembers, isLoading };
}

export default function MembershipReferendaTodoForLowerRank() {
  const address = useRealAddress();
  const [showEvidenceDetailPopup, setShowEvidenceDetailPopup] = useState(false);
  const [showEligibleMembersPopup, setShowEligibleMembersPopup] =
    useState(false);
  const { evidence } = useContextMyEvidence();
  const { memberData } = useContextMyMemberData();
  const { eligibleMembers, isLoading } = useEligibleMembers();
  const show = useShouldShowMembershipReferendaTodoForLowerRank();
  if (!show) {
    return null;
  }

  const { collectiveMember, coreMember } = memberData;
  const rank = collectiveMember?.rank;
  const isActive = coreMember?.isActive;
  const [wish, evidenceData] = evidence.toJSON();

  return (
    <>
      <div className="flex items-center">
        <TodoTag>Membership</TodoTag>
        <div className="text-textPrimary text14Medium">
          You have an on-chain{" "}
          <ClickableText onClick={() => setShowEvidenceDetailPopup(true)}>
            evidence
          </ClickableText>{" "}
          and you can contact{" "}
          <ClickableText onClick={() => setShowEligibleMembersPopup(true)}>
            eligible members
          </ClickableText>
          .
        </div>
      </div>
      {showEvidenceDetailPopup && (
        <EvidenceDetailPopup
          address={address}
          rank={rank}
          isActive={isActive}
          wish={wish}
          evidence={evidenceData}
          onClose={() => setShowEvidenceDetailPopup(false)}
        />
      )}
      {showEligibleMembersPopup && (
        <UserListPopup
          users={eligibleMembers}
          isLoading={isLoading}
          onClose={() => setShowEligibleMembersPopup(false)}
        />
      )}
    </>
  );
}
