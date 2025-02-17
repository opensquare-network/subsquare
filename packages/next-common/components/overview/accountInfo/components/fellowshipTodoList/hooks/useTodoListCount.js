import useShouldShowDemotionExpirationTodo from "./useShouldShowDemotionExpirationTodo";
import useShouldShowMemberEvidenceSubmissionTodo from "./useShouldShowMemberEvidenceSubmissionTodo";
import useShouldShowMembershipReferendaTodoForLowerRank from "./useShouldShowMembershipReferendaTodoForLowerRank";

export default function useTodoListCount() {
  const showEvidenceSubmissionTodo =
    useShouldShowMemberEvidenceSubmissionTodo();
  const showDemotionExpirationTodo = useShouldShowDemotionExpirationTodo();
  const showMembershipReferendaTodoForLowerRank =
    useShouldShowMembershipReferendaTodoForLowerRank();

  return [
    showEvidenceSubmissionTodo,
    showDemotionExpirationTodo,
    showMembershipReferendaTodoForLowerRank,
  ].filter(Boolean).length;
}
