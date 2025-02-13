import { useState } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import TodoTag from "./todoTag";
import ClickableText from "./clickableText";
import ApproveFellowshipMemberPopup from "next-common/components/fellowship/core/members/actions/approve/popup";
import {
  useMyDemotionTodoData,
  useShouldShowRetentionReferendaCreationTodo,
} from "../context/myDemotionTodo";

export default function RetentionReferendaCreationTodo() {
  const address = useRealAddress();
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const show = useShouldShowRetentionReferendaCreationTodo();
  const { myRank } = useMyDemotionTodoData();

  if (!show) {
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
          member={{ address, rank: myRank }}
          onClose={() => {
            setShowApprovePopup(false);
          }}
        />
      )}
    </>
  );
}
