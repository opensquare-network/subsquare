import TodoTag from "./todoTag";
import { useCollectivesApi } from "next-common/context/collectives/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import ClickableText from "./clickableText";
import { useState } from "react";
import SubmitEvidencePopup from "next-common/components/collectives/core/actions/more/submitEvidenceItem/popup";
import ApproveFellowshipMemberPopup from "next-common/components/fellowship/core/members/actions/approve/popup";
import Chains from "next-common/utils/consts/chains";
import { useFellowshipTodoListData } from "./context";

function RetentionEvidenceSubmissionTodo() {
  const collectivesApi = useCollectivesApi();
  const [showSubmitEvidencePopup, setShowSubmitEvidencePopup] = useState(false);
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
          api={collectivesApi}
          onClose={() => {
            setShowSubmitEvidencePopup(false);
          }}
        />
      )}
    </>
  );
}

function RetentionReferendaCreationTodo({ rank }) {
  const address = useRealAddress();
  const collectivesApi = useCollectivesApi();
  const [showApprovePopup, setShowApprovePopup] = useState(false);

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
          api={collectivesApi}
          chain={Chains.collectives}
          member={{ address, rank }}
          onClose={() => {
            setShowApprovePopup(false);
          }}
        />
      )}
    </>
  );
}

export default function ToDoItems() {
  const { todo } = useFellowshipTodoListData();
  const { showEvidenceSubmissionInfo, showApproveReferendaCreationInfo } = todo;

  return (
    <>
      {showEvidenceSubmissionInfo && <RetentionEvidenceSubmissionTodo />}
      {showApproveReferendaCreationInfo && <RetentionReferendaCreationTodo />}
    </>
  );
}
