import { useState } from "react";
import ActionButton from "./actionButton";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import pluralize from "pluralize";
import { useMemberPromotionEvidences } from "../hooks/evidence";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useMyPromotionTaskCount } from "./myTaskCount";

const MemberPromotionPopup = dynamicPopup(() =>
  import("./memberPromotionPopup"),
);

export function MemberPromotionTodo() {
  const memberPromotionEvidences = useMemberPromotionEvidences();
  const myTaskCount = useMyPromotionTaskCount(memberPromotionEvidences);
  const [showMemberPromotionPopup, setShowMemberPromotionPopup] =
    useState(false);

  if (myTaskCount === 0) {
    return null;
  }

  const total = memberPromotionEvidences?.length || 0;

  return (
    <TodoWrapper>
      <TodoTag>Membership</TodoTag>
      <TodoContent>
        {myTaskCount} of&nbsp;
        <a
          className="text-theme500 cursor-pointer"
          target="_blank"
          rel="noreferrer"
          href="/fellowship/members?evidence_only=true&wish=promotion"
        >
          {total} member promotion {pluralize("wish", total)}
        </a>
        &nbsp;{myTaskCount === 1 ? "needs" : "need"} your vote.&nbsp;
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
