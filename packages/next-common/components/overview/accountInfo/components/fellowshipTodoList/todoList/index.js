import { useFellowshipTodoList } from "../context";
import RetentionEvidenceSubmissionTodo from "./retentionEvidenceSubmissionTodo";
import RetentionReferendaCreationTodo from "./retentionReferendaCreationTodo";
import DemotedBumpAllTodo from "./demotedBumpAllTodo";
import { useDemotionTodoData } from "../context/demotionTodo";
import { useMyDemotionTodoData } from "../context/myDemotionTodo";

function TodoListWrapper({ children }) {
  return <div className="flex flex-col mt-[16px] gap-[4px]">{children}</div>;
}

export default function TodoList() {
  const {
    showEvidenceSubmissionTodo,
    showApproveReferendaCreationTodo,
    showDemotedBumpAllTodo,
  } = useFellowshipTodoList();
  const { expiredMembersCount } = useDemotionTodoData();
  const { myRank } = useMyDemotionTodoData();

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
