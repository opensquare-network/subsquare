import { useState } from "react";
import TodoTag from "./todoTag";
import ClickableText from "./clickableText";
import BatchBumpPopup from "next-common/components/fellowship/core/batchBump/popup";
import useDemotionExpiredMembers from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/hooks/expired";

export default function DemotionExpirationTodo() {
  const [showBumpAllPopup, setShowBumpAllPopup] = useState(false);
  const expiredMembers = useDemotionExpiredMembers();
  if (expiredMembers > 0) {
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
            {expiredMembers.length} members
          </a>
          &nbsp;can be demoted.&nbsp;
          <ClickableText onClick={() => setShowBumpAllPopup(true)}>
            Demote all
          </ClickableText>
        </div>
      </div>
      {showBumpAllPopup && (
        <BatchBumpPopup
          onClose={() => {
            setShowBumpAllPopup(false);
          }}
        />
      )}
    </>
  );
}
