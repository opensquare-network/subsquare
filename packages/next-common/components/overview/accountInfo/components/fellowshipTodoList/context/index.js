import { useMemo } from "react";
import DemotionExpirationTodoProvider, {
  useDemotionExpirationTodoData,
} from "./demotionExpirationTodo";
import MyDemotionTodoProvider, {
  useMyDemotionTodoData,
} from "./myDemotionTodo";
import ReferendaTodoProvider, { useReferendaTodoData } from "./referendaTodo";

export function FellowshipTodoListProvider({ children }) {
  return (
    <DemotionExpirationTodoProvider>
      <MyDemotionTodoProvider>
        <ReferendaTodoProvider>{children}</ReferendaTodoProvider>
      </MyDemotionTodoProvider>
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
  const { referendaToVote } = useReferendaTodoData();

  return useMemo(
    () => ({
      showEvidenceSubmissionTodo,
      showApproveReferendaCreationTodo,
      showDemotionExpirationTodo: expiredMembersCount > 0,
      showReferendaTodo: referendaToVote?.length > 0,
    }),
    [
      showEvidenceSubmissionTodo,
      showApproveReferendaCreationTodo,
      expiredMembersCount,
      referendaToVote,
    ],
  );
}

export function useFellowshipTodoListCount() {
  const todo = useFellowshipTodoList();
  return Object.values(todo).filter(Boolean).length;
}
