import { useFellowshipTodoListData } from "../context";
import RetentionEvidenceSubmissionTodo from "./retentionEvidenceSubmissionTodo";
import RetentionReferendaCreationTodo from "./retentionReferendaCreationTodo";
import DemotedBumpAllTodo from "./demotedBumpAllTodo";

function TodoListWrapper({ children }) {
  return <div className="flex flex-col mt-[16px] gap-[4px]">{children}</div>;
}

export default function TodoList() {
  const { todo, expiredMembersCount, myRank } = useFellowshipTodoListData();
  const {
    showEvidenceSubmissionTodo,
    showApproveReferendaCreationTodo,
    showDemotedBumpAllTodo,
  } = todo;

  return (
    <TodoListWrapper>
      {showEvidenceSubmissionTodo && <RetentionEvidenceSubmissionTodo />}
      {showApproveReferendaCreationTodo && (
        <RetentionReferendaCreationTodo rank={myRank} />
      )}
      {showDemotedBumpAllTodo && (
        <DemotedBumpAllTodo expiredMembersCount={expiredMembersCount} />
      )}
    </TodoListWrapper>
  );
}
