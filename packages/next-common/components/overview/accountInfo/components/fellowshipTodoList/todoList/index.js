import RetentionEvidenceSubmissionTodo from "./retentionEvidenceSubmissionTodo";
import DemotionExpirationTodo from "./demotionExpirationTodo";
import MemberReferendaTodo from "./memberReferendaTodo";
import useTodoListLoading from "next-common/components/overview/accountInfo/components/fellowshipTodoList/hooks/useTodoListLoading";
import useContextMyMember, {
  useIsCandidate,
  useIsMember,
} from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/hooks/mine";
import CandidateDemotionExpirationTodo from "./candidates/demotionExpirationTodo";

function MakeSureLoaded({ children }) {
  const isLoading = useTodoListLoading();
  if (isLoading) {
    return null;
  }

  return children;
}

export function OnlyLowRankMembers({ children }) {
  const member = useContextMyMember();
  const { rank } = member;
  // todo: ambassador may have a different rank threshold
  if (rank >= 3) {
    return null;
  }

  return children;
}

function OnlyMember({ children }) {
  const isMember = useIsMember();
  if (!isMember) {
    return null;
  }

  return children;
}

export function OnlyCandidate({ children }) {
  const isCandidate = useIsCandidate();
  if (!isCandidate) {
    return null;
  }

  return children;
}

export default function TodoList() {
  return (
    <MakeSureLoaded>
      <OnlyMember>
        <RetentionEvidenceSubmissionTodo />
        <MemberReferendaTodo />
      </OnlyMember>
      <DemotionExpirationTodo />
      <CandidateDemotionExpirationTodo />
    </MakeSureLoaded>
  );
}
