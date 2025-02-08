import { useFellowshipTodoList } from "../context";
import RetentionEvidenceSubmissionTodo from "./retentionEvidenceSubmissionTodo";
import RetentionReferendaCreationTodo from "./retentionReferendaCreationTodo";
import DemotedBumpAllTodo from "./demotedBumpAllTodo";
import { useDemotionTodoData } from "../context/demotionTodo";
import { useMyDemotionTodoData } from "../context/myDemotionTodo";
import ReferendaTodo from "./referendaTodo";
import { useReferendaTodoData } from "../context/referendaTodo";

function TodoListWrapper({ children }) {
  return <div className="flex flex-col mt-[16px] gap-[4px]">{children}</div>;
}

export default function TodoList() {
  const {
    showEvidenceSubmissionTodo,
    showApproveReferendaCreationTodo,
    showDemotedBumpAllTodo,
    showReferendaTodo,
  } = useFellowshipTodoList();
  const { expiredMembersCount } = useDemotionTodoData();
  const { myRank } = useMyDemotionTodoData();
  const {
    countOfTotalReferenda,
    countOfEligibleReferenda,
    referendaToVote,
    referendaVotes,
    myRank: myCollectiveRank,
  } = useReferendaTodoData();

  if (
    !showEvidenceSubmissionTodo &&
    !showApproveReferendaCreationTodo &&
    !showDemotedBumpAllTodo &&
    !showReferendaTodo
  ) {
    return null;
  }

  return (
    <TodoListWrapper>
      {showEvidenceSubmissionTodo && <RetentionEvidenceSubmissionTodo />}
      {showApproveReferendaCreationTodo && (
        <RetentionReferendaCreationTodo rank={myRank} />
      )}
      {showDemotedBumpAllTodo && (
        <DemotedBumpAllTodo expiredMembersCount={expiredMembersCount} />
      )}
      {showReferendaTodo && (
        <ReferendaTodo
          countOfTotalReferenda={countOfTotalReferenda}
          countOfEligibleReferenda={countOfEligibleReferenda}
          referendaToVote={referendaToVote}
          referendaVotes={referendaVotes}
          myRank={myCollectiveRank}
        />
      )}
    </TodoListWrapper>
  );
}
