import { useShouldShowDemotionExpirationTodo } from "./useShouldShowDemotionExpirationTodo";
import { useShouldShowRetentionEvidenceSubmissionTodo } from "./useShouldShowRetentionEvidenceSubmissionTodo";

export default function useTodoListCount() {
  const showEvidenceSubmissionTodo =
    useShouldShowRetentionEvidenceSubmissionTodo();
  const showDemotionExpirationTodo = useShouldShowDemotionExpirationTodo();

  return [showEvidenceSubmissionTodo, showDemotionExpirationTodo].filter(
    Boolean,
  ).length;
}
