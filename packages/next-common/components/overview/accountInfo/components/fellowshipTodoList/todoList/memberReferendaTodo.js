import TodoTag from "./todoTag";
import ClickableText from "./clickableText";
import { useContextMyEvidence } from "../context/myEvidence";
import { useContext, useState } from "react";
import { EvidenceDetailPopup } from "next-common/components/collectives/core/member/evidence";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useHasMemberReferendaTodo from "../hooks/useHasMemberReferendaTodo";
import UserListPopup from "./userListPopup";
import useContextMyMember from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/hooks/mine";
import { MembersContext } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/members";

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
  const { members, isLoading } = useContext(MembersContext);

  return (
    <UserListPopup users={members} isLoading={isLoading} onClose={onClose} />
  );
}

export default function MemberReferendaTodo() {
  const [showEvidenceDetailPopup, setShowEvidenceDetailPopup] = useState(false);
  const [showEligibleMembersPopup, setShowEligibleMembersPopup] =
    useState(false);
  const hasTodo = useHasMemberReferendaTodo();
  if (!hasTodo) {
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
