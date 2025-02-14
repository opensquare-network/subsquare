import RetentionEvidenceSubmissionTodo from "./retentionEvidenceSubmissionTodo";
import DemotionExpirationTodo from "./demotionExpirationTodo";
import useTodoListCount from "../hooks/useTodoListCount";
import RetentionReferendaTodoForLowerRank from "./retentionReferendaTodoForLowerRank";

function TodoListWrapper({ children }) {
  const count = useTodoListCount();
  if (count === 0) {
    return null;
  }
  return <div className="flex flex-col mt-[16px] gap-[4px]">{children}</div>;
}

export default function TodoList() {
  return (
    <TodoListWrapper>
      <RetentionEvidenceSubmissionTodo />
      <DemotionExpirationTodo />
      <RetentionReferendaTodoForLowerRank />
    </TodoListWrapper>
  );
}
