import useShouldShowDemotionExpirationTodo from "./useShouldShowDemotionExpirationTodo";
import useShouldShowRetentionEvidenceSubmissionTodo from "./useShouldShowRetentionEvidenceSubmissionTodo";
import useShouldShowRetentionReferendaTodoForLowerRank from "./useShouldShowRetentionReferendaTodoForLowerRank";

export default function useTodoListCount() {
  const showEvidenceSubmissionTodo =
    useShouldShowRetentionEvidenceSubmissionTodo();
  const showDemotionExpirationTodo = useShouldShowDemotionExpirationTodo();
  const showRetentionReferendaTodoForLowerRank =
    useShouldShowRetentionReferendaTodoForLowerRank();

  return [
    showEvidenceSubmissionTodo,
    showDemotionExpirationTodo,
    showRetentionReferendaTodoForLowerRank,
  ].filter(Boolean).length;
}
