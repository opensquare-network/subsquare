import { useState } from "react";
import ActionButton from "./actionButton";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import MemberRetentionPopup from "./memberRetentionPopup";
import pluralize from "pluralize";
import { useMemberRetentionEvidences } from "../hooks/evidence";

export default function MemberRetentionTodo() {
  const [showMemberRetentionPopup, setShowMemberRetentionPopup] =
    useState(false);

  const memberRetentionEvidences = useMemberRetentionEvidences();

  const count = memberRetentionEvidences?.length || 0;
  if (count === 0) {
    return null;
  }

  return (
    <TodoWrapper>
      <TodoTag>Membership</TodoTag>
      <TodoContent>
        <a
          className="text-theme500 cursor-pointer"
          target="_blank"
          rel="noreferrer"
          href="/fellowship/members?evidence_only=true&wish=retention"
        >
          {count} {pluralize("member", count)}
        </a>
        &nbsp;{count === 1 ? "wishes" : "wish"} to retain their ranks.&nbsp;{" "}
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
