import { useState } from "react";
import ActionButton from "./actionButton";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import MemberPromotionPopup from "./memberPromotionPopup";
import pluralize from "pluralize";
import {
  useCandidatePromotionEvidences,
  useMemberPromotionEvidences,
} from "../hooks/evidence";

function MemberPromotionTodoImpl({ promotionEvidences, memberOrCandidate }) {
  const [showMemberPromotionPopup, setShowMemberPromotionPopup] =
    useState(false);
  const count = promotionEvidences?.length || 0;
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
          href="/fellowship/members?evidence_only=true&wish=promotion"
        >
          {count} {pluralize(memberOrCandidate, count)}
        </a>
        &nbsp;wish to get promoted.&nbsp;{" "}
        <ActionButton onClick={() => setShowMemberPromotionPopup(true)}>
          Check All
        </ActionButton>
      </TodoContent>
      {showMemberPromotionPopup && (
        <MemberPromotionPopup
          promotions={promotionEvidences}
          onClose={() => setShowMemberPromotionPopup(false)}
        />
      )}
    </TodoWrapper>
  );
}

export function MemberPromotionTodo() {
  const memberPromotionEvidences = useMemberPromotionEvidences();
  return (
    <MemberPromotionTodoImpl
      promotionEvidences={memberPromotionEvidences}
      memberOrCandidate="member"
    />
  );
}

export function CandidatePromotionTodo() {
  const candidatePromotionEvidences = useCandidatePromotionEvidences();
  return (
    <MemberPromotionTodoImpl
      promotionEvidences={candidatePromotionEvidences}
      memberOrCandidate="candidate"
    />
  );
}
