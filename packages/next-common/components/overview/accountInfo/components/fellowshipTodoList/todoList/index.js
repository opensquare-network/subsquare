import { useFellowshipTodoListCount } from "../context";
import RetentionEvidenceSubmissionTodo from "./retentionEvidenceSubmissionTodo";
import RetentionReferendaCreationTodo from "./retentionReferendaCreationTodo";
import DemotionExpirationTodo from "./demotionExpirationTodo";

function TodoListWrapper({ children }) {
  const count = useFellowshipTodoListCount();
  if (count === 0) {
    return null;
  }
  return <div className="flex flex-col mt-[16px] gap-[4px]">{children}</div>;
}

export default function TodoList() {
  return (
    <TodoListWrapper>
      <RetentionEvidenceSubmissionTodo />
      <RetentionReferendaCreationTodo />
      <DemotionExpirationTodo />
    </TodoListWrapper>
  );
}
