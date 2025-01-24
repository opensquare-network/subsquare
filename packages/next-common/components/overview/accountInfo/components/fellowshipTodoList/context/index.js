import { createContext, useContext, useMemo } from "react";
import useMyDemotionTodo from "../hooks/useMyDemotionTodo";
import useDemotedBumpAllTodo from "../hooks/useDemotedBumpAllTodo";

const FellowshipTodoListContext = createContext();

function FellowshipTodoListProvider({ children }) {
  const {
    todo: { showEvidenceSubmissionTodo, showApproveReferendaCreationTodo },
    isLoading: isMyDemotionTodoLoading,
    myRank,
  } = useMyDemotionTodo();
  const {
    todo: { showDemotedBumpAllTodo },
    isLoading: isDemotedBumpAllLoading,
    expiredMembersCount,
  } = useDemotedBumpAllTodo();

  const data = useMemo(
    () => ({
      todo: {
        showEvidenceSubmissionTodo,
        showApproveReferendaCreationTodo,
        showDemotedBumpAllTodo,
      },
      myRank,
      expiredMembersCount,
      isLoading: isMyDemotionTodoLoading || isDemotedBumpAllLoading,
    }),
    [
      showEvidenceSubmissionTodo,
      showApproveReferendaCreationTodo,
      showDemotedBumpAllTodo,
      expiredMembersCount,
      isMyDemotionTodoLoading,
      isDemotedBumpAllLoading,
      myRank,
    ],
  );

  return (
    <FellowshipTodoListContext.Provider value={data}>
      {children}
    </FellowshipTodoListContext.Provider>
  );
}

function useFellowshipTodoListData() {
  return useContext(FellowshipTodoListContext);
}

export {
  FellowshipTodoListContext,
  FellowshipTodoListProvider,
  useFellowshipTodoListData,
};
