import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import ActionButton from "./actionButton";
import { useContextMyEvidence } from "../context/hooks/evidence";
import { useContext, useState } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useHasMemberReferendaTodo } from "../hooks/useHasTodo";
import { useContextMyCoreMember } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/hooks/mine";
import { CoreMembersContext } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreMembers";
import dynamicPopup from "next-common/lib/dynamic/popup";

const UserListPopup = dynamicPopup(() => import("./userListPopup"));
const EvidenceDetailPopup = dynamicPopup(() =>
  import("next-common/components/collectives/core/member/evidence"),
);

function EvidencePopup({ onClose }) {
  const address = useRealAddress();
  const { evidence } = useContextMyEvidence();
  const member = useContextMyCoreMember();
  const { rank, status: { isActive } = {} } = member || {};

  const [wish, evidenceData] = evidence;

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
  const { members, isLoading } = useContext(CoreMembersContext);

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
      <TodoWrapper>
        <TodoTag>Membership</TodoTag>
        <TodoContent>
          You have an on-chain&nbsp;
          <ActionButton onClick={() => setShowEvidenceDetailPopup(true)}>
            evidence
          </ActionButton>
          &nbsp;with no referenda and you can contact&nbsp;
          <ActionButton onClick={() => setShowEligibleMembersPopup(true)}>
            eligible members
          </ActionButton>
          &nbsp;to handle it.
        </TodoContent>
      </TodoWrapper>
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
