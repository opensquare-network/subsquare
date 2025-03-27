import { useState } from "react";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import { useDemotionExpiredMembers } from "../context/hooks/expired";
import dynamicPopup from "next-common/lib/dynamic/popup";
import ActionButton from "./actionButton";
import { useHasDemotionExpirationTodo } from "../hooks/useHasTodo";

const BatchBumpPopup = dynamicPopup(() => import("./bumpAllPopup"));

export default function DemotionExpirationTodo() {
  const [showBumpAllPopup, setShowBumpAllPopup] = useState(false);
  const { members } = useDemotionExpiredMembers();
  const hasTodo = useHasDemotionExpirationTodo();
  if (!hasTodo) {
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
            href="/fellowship/members?period=demotion_period_expired"
          >
            {members.length} members
          </a>
          &nbsp;can be demoted.&nbsp;
          <ActionButton onClick={() => setShowBumpAllPopup(true)}>
            Demote all
          </ActionButton>
        </TodoContent>
      </TodoWrapper>
      {showBumpAllPopup && (
        <BatchBumpPopup onClose={() => setShowBumpAllPopup(false)} />
      )}
    </>
  );
}
