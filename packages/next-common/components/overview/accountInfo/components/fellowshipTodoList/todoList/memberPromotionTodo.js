import { useState } from "react";
import ActionButton from "./actionButton";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import MemberPromotionPopup from "./memberPromotionPopup";
import pluralize from "pluralize";
import { useMemberPromotions } from "../hooks/evidence";

export default function MemberPromotionTodo() {
  const [showMemberPromotionPopup, setShowMemberPromotionPopup] =
    useState(false);
  const promotions = useMemberPromotions();

  const count = promotions?.length || 0;
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
          {count} {pluralize("member", count)}
        </a>
        &nbsp;want to get promoted.&nbsp;{" "}
        <ActionButton onClick={() => setShowMemberPromotionPopup(true)}>
          Check All
        </ActionButton>
      </TodoContent>
      {showMemberPromotionPopup && (
        <MemberPromotionPopup
          promotions={promotions}
          onClose={() => setShowMemberPromotionPopup(false)}
        />
      )}
    </TodoWrapper>
  );
}
