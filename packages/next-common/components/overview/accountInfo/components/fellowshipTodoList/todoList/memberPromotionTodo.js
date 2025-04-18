import { useState } from "react";
import ActionButton from "./actionButton";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import pluralize from "pluralize";
import { useMemberPromotionEvidences } from "../hooks/evidence";
import dynamicPopup from "next-common/lib/dynamic/popup";

const MemberPromotionPopup = dynamicPopup(() =>
  import("./memberPromotionPopup"),
);

export function MemberPromotionTodo() {
  const memberPromotionEvidences = useMemberPromotionEvidences();
  const [showMemberPromotionPopup, setShowMemberPromotionPopup] =
    useState(false);
  const count = memberPromotionEvidences?.length || 0;
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
        &nbsp;{count === 1 ? "wishes" : "wish"} to get promoted.&nbsp;{" "}
        <ActionButton onClick={() => setShowMemberPromotionPopup(true)}>
          Check All
        </ActionButton>
      </TodoContent>
      {showMemberPromotionPopup && (
        <MemberPromotionPopup
          promotions={memberPromotionEvidences}
          onClose={() => setShowMemberPromotionPopup(false)}
        />
      )}
    </TodoWrapper>
  );
}
