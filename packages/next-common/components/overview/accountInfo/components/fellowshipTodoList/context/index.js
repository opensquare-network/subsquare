import { useMemo } from "react";
import DemotionExpirationTodoProvider, {
  useDemotionExpirationTodoData,
  useShouldShowDemotionExpirationTodo,
} from "./demotionExpirationTodo";
import MyDemotionTodoProvider, {
  useMyDemotionTodoData,
  useShouldShowRetentionEvidenceSubmissionTodo,
  useShouldShowRetentionReferendaCreationTodo,
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
  const showEvidenceSubmissionTodo =
    useShouldShowRetentionEvidenceSubmissionTodo();
  const showApproveReferendaCreationTodo =
    useShouldShowRetentionReferendaCreationTodo();
  const showDemotionExpirationTodo = useShouldShowDemotionExpirationTodo();

  return useMemo(
    () => ({
      showEvidenceSubmissionTodo,
      showApproveReferendaCreationTodo,
      showDemotionExpirationTodo,
    }),
    [
      showEvidenceSubmissionTodo,
      showApproveReferendaCreationTodo,
      showDemotionExpirationTodo,
    ],
  );
}

export function useFellowshipTodoListCount() {
  const todo = useFellowshipTodoList();
  return Object.values(todo).filter(Boolean).length;
}
