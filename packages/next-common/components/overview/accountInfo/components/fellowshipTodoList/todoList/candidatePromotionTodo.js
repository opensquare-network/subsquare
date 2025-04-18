import { useState } from "react";
import ActionButton from "./actionButton";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import pluralize from "pluralize";
import { useCandidatePromotionEvidences } from "../hooks/evidence";
import dynamicPopup from "next-common/lib/dynamic/popup";

const MemberPromotionPopup = dynamicPopup(() =>
  import("./memberPromotionPopup"),
);

export function CandidatePromotionTodo() {
  const candidatePromotionEvidences = useCandidatePromotionEvidences();
  const [showMemberPromotionPopup, setShowMemberPromotionPopup] =
    useState(false);
  const count = candidatePromotionEvidences?.length || 0;
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
          href="/fellowship/members?tab=candidates&evidence_only=true&wish=promotion"
        >
          {count} {pluralize("candidate", count)}
        </a>
        &nbsp;{count === 1 ? "wishes" : "wish"} to get promoted.&nbsp;{" "}
        <ActionButton onClick={() => setShowMemberPromotionPopup(true)}>
          Check All
        </ActionButton>
      </TodoContent>
      {showMemberPromotionPopup && (
        <MemberPromotionPopup
          title="Candidate Promotion"
          promotions={candidatePromotionEvidences}
          onClose={() => setShowMemberPromotionPopup(false)}
        />
      )}
    </TodoWrapper>
  );
}
