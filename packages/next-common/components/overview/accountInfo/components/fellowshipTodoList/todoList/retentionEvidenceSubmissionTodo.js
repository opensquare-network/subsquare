import { useState } from "react";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import dynamicPopup from "next-common/lib/dynamic/popup";
import ActionButton from "./actionButton";
import { useHasRetentionEvidenceSubmissionTodo } from "../hooks/useHasTodo";

const SubmitEvidencePopup = dynamicPopup(() =>
  import(
    "next-common/components/collectives/core/actions/more/submitEvidenceItem/popup"
  ),
);

export default function RetentionEvidenceSubmissionTodo() {
  const [showSubmitEvidencePopup, setShowSubmitEvidencePopup] = useState(false);
  const hasTodo = useHasRetentionEvidenceSubmissionTodo();
  if (!hasTodo) {
    return null;
  }

  return (
    <>
      <TodoWrapper>
        <TodoTag>Membership</TodoTag>
        <TodoContent>
          <span>Your demotion period of membership is closing.&nbsp;</span>
          <ActionButton onClick={() => setShowSubmitEvidencePopup(true)}>
            Submit your evidence
          </ActionButton>
          &nbsp; for retention.
        </TodoContent>
      </TodoWrapper>
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
