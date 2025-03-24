import { useState } from "react";
import TodoTag from "../todoTag";
import { useDemotionExpiredCandidates } from "../../context/hooks/expired";
import dynamicPopup from "next-common/lib/dynamic/popup";
import ActionButton from "../actionButton";
import { useHasCandidateDemotionExpirationTodo } from "../../hooks/useHasTodo";

const CandidateBatchBumpPopup = dynamicPopup(() => import("./bumpAllPopup"));

export default function CandidateDemotionExpirationTodo() {
  const [showBumpAllPopup, setShowBumpAllPopup] = useState(false);
  const { members } = useDemotionExpiredCandidates();
  const hasTodo = useHasCandidateDemotionExpirationTodo();
  if (!hasTodo) {
    return null;
  }

  return (
    <>
      <div className="flex items-center">
        <TodoTag>Membership</TodoTag>
        <div className="text-textPrimary text14Medium">
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
        </div>
      </div>
      {showBumpAllPopup && (
        <CandidateBatchBumpPopup onClose={() => setShowBumpAllPopup(false)} />
      )}
    </>
  );
}
