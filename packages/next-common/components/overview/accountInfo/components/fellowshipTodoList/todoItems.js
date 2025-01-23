import TodoTag from "./todoTag";
import { useCollectivesApi } from "next-common/context/collectives/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import ClickableText from "./clickableText";
import { useState } from "react";
import SubmitEvidencePopup from "next-common/components/collectives/core/actions/more/submitEvidenceItem/popup";
import ApproveFellowshipMemberPopup from "next-common/components/fellowship/core/members/actions/approve/popup";
import Chains from "next-common/utils/consts/chains";
import { useFellowshipTodoListData } from "./context";
import BatchBumpPopup from "next-common/components/fellowship/core/batchBump/popup";
import { ApiProviderWithApi } from "next-common/context/api";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { useCoreFellowshipParams } from "./collectives";
import { useBlockHeight } from "next-common/context/blockHeight";

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

function DemotedBumpAllTodo({ expiredMembersCount }) {
  const api = useCollectivesApi();
  const { params } = useCoreFellowshipParams(api);
  const [showBumpAllPopup, setShowBumpAllPopup] = useState(false);
  const { blockHeight } = useBlockHeight();

  return (
    <>
      <div className="flex items-center">
        <TodoTag>Membership</TodoTag>
        <div className="text-textPrimary text14Medium">
          {expiredMembersCount} members can be demoted.&nbsp;
          <ClickableText onClick={() => setShowBumpAllPopup(true)}>
            Bump all
          </ClickableText>
        </div>
      </div>
      {showBumpAllPopup && (
        <ApiProviderWithApi api={api}>
          <CollectivesProvider section="fellowship" params={params}>
            <BatchBumpPopup
              blockHeight={blockHeight}
              onClose={() => {
                setShowBumpAllPopup(false);
              }}
            />
          </CollectivesProvider>
        </ApiProviderWithApi>
      )}
    </>
  );
}

export default function ToDoItems() {
  const { todo, expiredMembersCount } = useFellowshipTodoListData();
  const {
    showEvidenceSubmissionTodo,
    showApproveReferendaCreationTodo,
    showDemotedBumpAllTodo,
  } = todo;

  return (
    <>
      {showEvidenceSubmissionTodo && <RetentionEvidenceSubmissionTodo />}
      {showApproveReferendaCreationTodo && <RetentionReferendaCreationTodo />}
      {showDemotedBumpAllTodo && (
        <DemotedBumpAllTodo expiredMembersCount={expiredMembersCount} />
      )}
    </>
  );
}
