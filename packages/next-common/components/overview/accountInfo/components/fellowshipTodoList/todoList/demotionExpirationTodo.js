import { useState } from "react";
import TodoTag from "./todoTag";
import ClickableText from "./clickableText";
import BatchBumpPopup from "next-common/components/fellowship/core/batchBump/popup";
import {
  useDemotionExpirationTodoData,
  useShouldShowDemotionExpirationTodo,
} from "../context/demotionExpirationTodo";

export default function DemotionExpirationTodo() {
  const [showBumpAllPopup, setShowBumpAllPopup] = useState(false);
  const show = useShouldShowDemotionExpirationTodo();
  const { expiredMembersCount } = useDemotionExpirationTodoData();

  if (!show) {
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
            {expiredMembersCount} members
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
