import { useMemo } from "react";
import DemotionTodoProvider, { useDemotionTodoData } from "./demotionTodo";
import MyDemotionTodoProvider, {
  useMyDemotionTodoData,
} from "./myDemotionTodo";
import ReferendaTodoProvider, { useReferendaTodoData } from "./referendaTodo";

export function FellowshipTodoListProvider({ children }) {
  return (
    <DemotionTodoProvider>
      <MyDemotionTodoProvider>
        <ReferendaTodoProvider>{children}</ReferendaTodoProvider>
      </MyDemotionTodoProvider>
    </DemotionTodoProvider>
  );
}

export function useFellowshipTodoListLoading() {
  const { isLoading: isMyDemotionTodoLoading } = useMyDemotionTodoData();
  const { isLoading: isDemotedBumpAllLoading } = useDemotionTodoData();
  return isMyDemotionTodoLoading || isDemotedBumpAllLoading;
}

export function useFellowshipTodoList() {
  const {
    todo: { showEvidenceSubmissionTodo, showApproveReferendaCreationTodo },
  } = useMyDemotionTodoData();
  const {
    todo: { showDemotedBumpAllTodo },
  } = useDemotionTodoData();
  const {
    todo: { showReferendaTodo },
  } = useReferendaTodoData();

  return useMemo(
    () => ({
      showEvidenceSubmissionTodo,
      showApproveReferendaCreationTodo,
      showDemotedBumpAllTodo,
      showReferendaTodo,
    }),
    [
      showEvidenceSubmissionTodo,
      showApproveReferendaCreationTodo,
      showDemotedBumpAllTodo,
      showReferendaTodo,
    ],
  );
}

export function useFellowshipTodoListCount() {
  const todo = useFellowshipTodoList();
  return Object.values(todo).filter(Boolean).length;
}
