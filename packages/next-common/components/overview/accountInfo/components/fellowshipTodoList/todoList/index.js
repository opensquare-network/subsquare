import RetentionEvidenceSubmissionTodo from "./retentionEvidenceSubmissionTodo";
import DemotionExpirationTodo from "./demotionExpirationTodo";
import MemberReferendaTodo from "./memberReferendaTodo";
import useTodoListLoading from "next-common/components/overview/accountInfo/components/fellowshipTodoList/hooks/useTodoListLoading";
import {
  useContextMyCoreMember,
  useIsCollectivesMember,
  useIsCoreCandidate,
  useIsCoreMember,
} from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/hooks/mine";
import CandidateDemotionExpirationTodo from "./candidates/demotionExpirationTodo";
import SalaryRegistrationTodo from "./salaryRegistrationTodo";
import SalaryPayoutTodo from "./salaryPayoutTodo";
import MyReferendaVotesTodo from "./myReferendaVotesTodo";
import MemberEvidencesTodo from "./memberEvidencesTodo";
import CandidateEvidencesTodo from "./candidateEvidencesTodo";
import useHasTodo from "../hooks/useHasTodo";

function MakeSureLoaded({ children }) {
  const isLoading = useTodoListLoading();
  if (isLoading) {
    return null;
  }

  return children;
}

export function OnlyLowRankMembers({ children }) {
  const member = useContextMyCoreMember();
  const { rank } = member || {};
  // todo: ambassador may have a different rank threshold
  if (rank >= 3) {
    return null;
  }

  return children;
}

export function OnlyHighRankMembers({ children }) {
  const member = useContextMyCoreMember();
  const { rank } = member || {};
  // todo: ambassador may have a different rank threshold
  if (rank < 3) {
    return null;
  }

  return children;
}

function OnlyCoreMember({ children }) {
  const isMember = useIsCoreMember();
  if (!isMember) {
    return null;
  }

  return children;
}

export function OnlyCoreCandidate({ children }) {
  const isCandidate = useIsCoreCandidate();
  if (!isCandidate) {
    return null;
  }

  return children;
}

export function OnlyCollectivesMember({ children }) {
  const isCollectivesMember = useIsCollectivesMember();
  if (!isCollectivesMember) {
    return null;
  }

  return children;
}

export default function TodoList() {
  const hasTodo = useHasTodo();
  if (!hasTodo) {
    return null;
  }

  return (
    <div className="flex flex-col mt-[16px] gap-[4px]">
      <MakeSureLoaded>
        <OnlyCoreMember>
          <RetentionEvidenceSubmissionTodo />
          <MemberReferendaTodo />
        </OnlyCoreMember>
        <DemotionExpirationTodo />
        <CandidateDemotionExpirationTodo />
        <OnlyCollectivesMember>
          <SalaryRegistrationTodo />
          <SalaryPayoutTodo />
          <MyReferendaVotesTodo />
          <OnlyHighRankMembers>
            <MemberEvidencesTodo />
            <CandidateEvidencesTodo />
          </OnlyHighRankMembers>
        </OnlyCollectivesMember>
      </MakeSureLoaded>
    </div>
  );
}
