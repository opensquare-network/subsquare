import { useState } from "react";
import ActionButton from "./actionButton";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import {
  useCandidatePromotionEvidences,
  useMemberPromotionEvidences,
} from "../hooks/evidence";
import dynamicPopup from "next-common/lib/dynamic/popup";
import usePromotionWishesOfNeedingMyVote from "next-common/components/overview/accountInfo/components/fellowshipTodoList/hooks/usePromotionWishesOfNeedingMyVote";

const MemberPromotionPopup = dynamicPopup(() =>
  import("./memberPromotionPopup"),
);

function MemberPromotionTodoImpl({ promotionEvidences, memberOrCandidate }) {
  const promotionWishesOfNeedingMyVote =
    usePromotionWishesOfNeedingMyVote(promotionEvidences);
  const [showMemberPromotionPopup, setShowMemberPromotionPopup] =
    useState(false);
  const count = promotionEvidences?.length || 0;
  if (count === 0) {
    return null;
  }

  let href = {
    member: "/fellowship/members?evidence_only=true&wish=promotion",
    candidate:
      "/fellowship/members?tab=candidates&evidence_only=true&wish=promotion",
  }[memberOrCandidate];

  return (
    <TodoWrapper>
      <TodoTag>Membership</TodoTag>
      <TodoContent>
        <span>{promotionWishesOfNeedingMyVote.length} of</span>
        <a
          className="text-theme500 cursor-pointer"
          target="_blank"
          rel="noreferrer"
          href={href}
        >
          <span>
            &nbsp;{count} {memberOrCandidate}
          </span>
        </a>
        <span>
          <span>&nbsp;promotion&nbsp;</span>
          {count > 1 ? "wishes" : "wish"}
          &nbsp;needs your vote.&nbsp;
        </span>
        <ActionButton onClick={() => setShowMemberPromotionPopup(true)}>
          Check All
        </ActionButton>
      </TodoContent>
      {showMemberPromotionPopup && (
        <MemberPromotionPopup
          promotions={promotionWishesOfNeedingMyVote}
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
