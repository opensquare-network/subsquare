import { useFellowshipTodoListCount } from "../context";
import RetentionEvidenceSubmissionTodo from "./retentionEvidenceSubmissionTodo";
import RetentionReferendaCreationTodo from "./retentionReferendaCreationTodo";
import DemotedBumpAllTodo from "./demotedBumpAllTodo";
import { useDemotionTodoData } from "../context/demotionTodo";
import { useMyDemotionTodoData } from "../context/myDemotionTodo";

function TodoListWrapper({ children }) {
  const count = useFellowshipTodoListCount();
  if (count === 0) {
    return null;
  }
  return <div className="flex flex-col mt-[16px] gap-[4px]">{children}</div>;
}

export default function TodoList() {
  const { expiredMembersCount } = useDemotionTodoData();
  const { myRank } = useMyDemotionTodoData();

  return (
    <TodoListWrapper>
      <RetentionEvidenceSubmissionTodo />
      <RetentionReferendaCreationTodo rank={myRank} />
      <DemotedBumpAllTodo expiredMembersCount={expiredMembersCount} />
    </TodoListWrapper>
  );
}
