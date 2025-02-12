import { useState } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import TodoTag from "./todoTag";
import ClickableText from "./clickableText";
import ApproveFellowshipMemberPopup from "next-common/components/fellowship/core/members/actions/approve/popup";
import { useMyDemotionTodoData } from "../context/myDemotionTodo";

export default function RetentionReferendaCreationTodo({ rank }) {
  const address = useRealAddress();
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const {
    todo: { showApproveReferendaCreationTodo },
  } = useMyDemotionTodoData();

  if (!showApproveReferendaCreationTodo) {
    return null;
  }

  return (
    <>
      <div className="flex items-center">
        <TodoTag>Membership</TodoTag>
        <div className="text-textPrimary text14Medium">
          Your demotion period of membership is closing.{" "}
          <ClickableText onClick={() => setShowApprovePopup(true)}>
            Submit a referenda
          </ClickableText>{" "}
          for retention
        </div>
      </div>
      {showApprovePopup && (
        <ApproveFellowshipMemberPopup
          member={{ address, rank }}
          onClose={() => {
            setShowApprovePopup(false);
          }}
        />
      )}
    </>
  );
}
