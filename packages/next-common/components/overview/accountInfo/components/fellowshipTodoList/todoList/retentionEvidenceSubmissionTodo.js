import { useState } from "react";
import TodoTag from "./todoTag";
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
      <div className="flex items-center">
        <TodoTag>Membership</TodoTag>
        <div className="flex flex-wrap text-textPrimary text14Medium items-center">
          Your demotion period of membership is closing.{" "}
          <ActionButton onClick={() => setShowSubmitEvidencePopup(true)}>
            Submit your evidence
          </ActionButton>{" "}
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
