import { useMemo } from "react";
import DemotionTodoProvider, { useDemotionTodoData } from "./demotionTodo";
import MyDemotionTodoProvider, {
  useMyDemotionTodoData,
} from "./myDemotionTodo";

export function FellowshipTodoListProvider({ children }) {
  return (
    <DemotionTodoProvider>
      <MyDemotionTodoProvider>{children}</MyDemotionTodoProvider>
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

  return useMemo(
    () => ({
      showEvidenceSubmissionTodo,
      showApproveReferendaCreationTodo,
      showDemotedBumpAllTodo,
    }),
    [
      showEvidenceSubmissionTodo,
      showApproveReferendaCreationTodo,
      showDemotedBumpAllTodo,
    ],
  );
}

export function useFellowshipTodoListCount() {
  const todo = useFellowshipTodoList();
  return Object.values(todo).filter(Boolean).length;
}
