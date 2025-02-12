import { useMemo } from "react";
import DemotionExpirationTodoProvider, {
  useDemotionExpirationTodoData,
} from "./demotionExpirationTodo";
import MyDemotionTodoProvider, {
  useMyDemotionTodoData,
} from "./myDemotionTodo";

export function FellowshipTodoListProvider({ children }) {
  return (
    <DemotionExpirationTodoProvider>
      <MyDemotionTodoProvider>{children}</MyDemotionTodoProvider>
    </DemotionExpirationTodoProvider>
  );
}

export function useFellowshipTodoListLoading() {
  const { isLoading: isMyDemotionTodoLoading } = useMyDemotionTodoData();
  const { isLoading: isDemotedBumpAllLoading } =
    useDemotionExpirationTodoData();
  return isMyDemotionTodoLoading || isDemotedBumpAllLoading;
}

export function useFellowshipTodoList() {
  const {
    todo: { showEvidenceSubmissionTodo, showApproveReferendaCreationTodo },
  } = useMyDemotionTodoData();
  const { expiredMembersCount } = useDemotionExpirationTodoData();

  return useMemo(
    () => ({
      showEvidenceSubmissionTodo,
      showApproveReferendaCreationTodo,
      showDemotionExpirationTodo: expiredMembersCount > 0,
    }),
    [
      showEvidenceSubmissionTodo,
      showApproveReferendaCreationTodo,
      expiredMembersCount,
    ],
  );
}

export function useFellowshipTodoListCount() {
  const todo = useFellowshipTodoList();
  return Object.values(todo).filter(Boolean).length;
}
