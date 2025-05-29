import { useState } from "react";
import ActionButton from "./actionButton";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import MemberRetentionPopup from "./memberRetentionPopup";
import pluralize from "pluralize";
import { useMemberRetentionEvidences } from "../hooks/evidence";
import { useMyRetentionTaskCount } from "./myTaskCount";

export default function MemberRetentionTodo() {
  const [showMemberRetentionPopup, setShowMemberRetentionPopup] =
    useState(false);

  const memberRetentionEvidences = useMemberRetentionEvidences();
  const myTaskCount = useMyRetentionTaskCount(memberRetentionEvidences);
  if (myTaskCount === 0) {
    return null;
  }

  const total = memberRetentionEvidences?.length || 0;

  return (
    <TodoWrapper>
      <TodoTag>Membership</TodoTag>
      <TodoContent>
        {myTaskCount} of&nbsp;
        <a
          className="text-theme500 cursor-pointer"
          target="_blank"
          rel="noreferrer"
          href="/fellowship/members?evidence_only=true&wish=retention"
        >
          {total} member retention {pluralize("wish", total)}
        </a>
        &nbsp;{myTaskCount === 1 ? "needs" : "need"} your vote.&nbsp;
        <ActionButton onClick={() => setShowMemberRetentionPopup(true)}>
          Check All
        </ActionButton>
      </TodoContent>
      {showMemberRetentionPopup && (
        <MemberRetentionPopup
          retentions={memberRetentionEvidences}
          onClose={() => setShowMemberRetentionPopup(false)}
        />
      )}
    </TodoWrapper>
  );
}
