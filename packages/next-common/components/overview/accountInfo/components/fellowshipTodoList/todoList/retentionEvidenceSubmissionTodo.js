import { useState } from "react";
import TodoTag from "./todoTag";
import ClickableText from "./clickableText";
import SubmitEvidencePopup from "next-common/components/collectives/core/actions/more/submitEvidenceItem/popup";
import { useIsDemotionClosing } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/hooks/demotion";
import { useContextMyEvidence } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/myEvidence";

export default function RetentionEvidenceSubmissionTodo() {
  const [showSubmitEvidencePopup, setShowSubmitEvidencePopup] = useState(false);
  const isDemotionClosing = useIsDemotionClosing();
  const { evidence } = useContextMyEvidence();
  if (!isDemotionClosing && evidence && evidence.isNone) {
    return null;
  }

  return (
    <>
      <div className="flex items-center">
        <TodoTag>Membership</TodoTag>
        <div className="text-textPrimary text14Medium">
          Your demotion period of membership is closing.{" "}
          <ClickableText onClick={() => setShowSubmitEvidencePopup(true)}>
            Submit your evidence
          </ClickableText>{" "}
          for retention
        </div>
      </div>
      {showSubmitEvidencePopup && (
        <SubmitEvidencePopup
          onClose={() => {
            setShowSubmitEvidencePopup(false);
          }}
        />
      )}
    </>
  );
}
