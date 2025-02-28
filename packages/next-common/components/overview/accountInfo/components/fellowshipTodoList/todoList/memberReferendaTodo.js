import TodoTag from "./todoTag";
import ClickableText from "./clickableText";
import { useContextMyEvidence } from "../context/hooks/evidence";
import { useContext, useState } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useHasMemberReferendaTodo from "../hooks/useHasMemberReferendaTodo";
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
