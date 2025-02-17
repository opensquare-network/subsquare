import { useContextMyEvidence } from "../context/myEvidence";
import { useIsDemotionClosing } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/hooks/demotion";

export default function useShouldShowMemberEvidenceSubmissionTodo() {
  const isDemotionClosing = useIsDemotionClosing();
  const { evidence } = useContextMyEvidence();
  return isDemotionClosing && evidence && evidence.isNone;
}
