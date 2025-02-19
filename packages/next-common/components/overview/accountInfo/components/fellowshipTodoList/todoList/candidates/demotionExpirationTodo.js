import { useState } from "react";
import TodoTag from "../todoTag";
import ClickableText from "../clickableText";
import { useDemotionExpiredCandidateMembers } from "../../context/hooks/expired";
import dynamicPopup from "next-common/lib/dynamic/popup";

const CandidateBatchBumpPopup = dynamicPopup(() => import("./bumpAllPopup"));

export default function CandidateDemotionExpirationTodo() {
  const [showBumpAllPopup, setShowBumpAllPopup] = useState(false);
  const { expiredMembers } = useDemotionExpiredCandidateMembers();
  if (!expiredMembers?.length) {
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
            href="https://collectives.subsquare.io/fellowship/members?tab=candidates&period=offboard_expired"
          >
            {expiredMembers.length} candidates
          </a>
          &nbsp;can be offboard.&nbsp;
          <ClickableText onClick={() => setShowBumpAllPopup(true)}>
            Offboard all
          </ClickableText>
        </div>
      </div>
      {showBumpAllPopup && (
        <CandidateBatchBumpPopup onClose={() => setShowBumpAllPopup(false)} />
      )}
    </>
  );
}
