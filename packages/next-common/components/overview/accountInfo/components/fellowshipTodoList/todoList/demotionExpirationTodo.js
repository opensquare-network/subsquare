import { useState } from "react";
import TodoTag from "./todoTag";
import ClickableText from "./clickableText";
import { useDemotionExpiredMembers } from "../context/hooks/expired";
import dynamicPopup from "next-common/lib/dynamic/popup";

const BatchBumpPopup = dynamicPopup(() => import("./bumpAllPopup"));

export default function DemotionExpirationTodo() {
  const [showBumpAllPopup, setShowBumpAllPopup] = useState(false);
  const { members } = useDemotionExpiredMembers();
  if (!members?.length) {
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
            href="https://collectives.subsquare.io/fellowship/members?period=demotion_period_expired"
          >
            {members.length} members
          </a>
          &nbsp;can be demoted.&nbsp;
          <ClickableText onClick={() => setShowBumpAllPopup(true)}>
            Demote all
          </ClickableText>
        </div>
      </div>
      {showBumpAllPopup && (
        <BatchBumpPopup onClose={() => setShowBumpAllPopup(false)} />
      )}
    </>
  );
}
