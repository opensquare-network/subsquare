import { useState } from "react";
import { TodoContent, TodoTag, TodoWrapper } from "../styled";
import { useDemotionExpiredCandidates } from "../../context/hooks/expired";
import dynamicPopup from "next-common/lib/dynamic/popup";
import ActionButton from "../actionButton";

const CandidateBatchBumpPopup = dynamicPopup(() => import("./bumpAllPopup"));

export default function CandidateDemotionExpirationTodo() {
  const [showBumpAllPopup, setShowBumpAllPopup] = useState(false);
  const { members } = useDemotionExpiredCandidates();

  if (!members?.length) {
    return null;
  }

  return (
    <>
      <TodoWrapper>
        <TodoTag>Membership</TodoTag>
        <TodoContent>
          <a
            className="text-theme500 cursor-pointer"
            target="_blank"
            rel="noreferrer"
            href="/fellowship/members?tab=candidates&period=offboard_expired"
          >
            {members.length} candidates
          </a>
          &nbsp;can be offboard.&nbsp;
          <ActionButton onClick={() => setShowBumpAllPopup(true)}>
            Offboard all
          </ActionButton>
        </TodoContent>
      </TodoWrapper>
      {showBumpAllPopup && (
        <CandidateBatchBumpPopup onClose={() => setShowBumpAllPopup(false)} />
      )}
    </>
  );
}
