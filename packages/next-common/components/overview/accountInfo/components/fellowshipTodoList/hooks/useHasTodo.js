import { useContextMyMembershipReferenda } from "../context/myMembershipReferenda";
import { useContextMyEvidence } from "../context/hooks/evidence";
import {
  useContextMyCoreMember,
  useIsImported,
  useIsSalaryPayout,
  useIsSalaryRegistered,
  useMySalary,
} from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/hooks/mine";
import {
  useCandidateCoreMembers,
  useNonCandidateCoreMembers,
} from "../context/hooks/coreMembers";
import { useTodoEvidences } from "next-common/components/fellowship/core/memberWarnings";
import {
  useDemotionExpiredCandidates,
  useDemotionExpiredMembers,
} from "../context/hooks/expired";
import { useMyUnVotedReferenda } from "../context/hooks/votes";
import { useIsDemotionClosing } from "../context/hooks/demotion";
import { useContextSalaryStats } from "../context/salaryStats";
import {
  useIsInSalaryRegistrationPeriod,
  useIsSalaryPayoutPeriod,
} from "next-common/hooks/fellowship/salary/useIsInSalaryRegistrationPeriod";

export function useHasMemberReferendaTodo() {
  const { evidence } = useContextMyEvidence();
  const { myMembershipReferenda } = useContextMyMembershipReferenda();
  const member = useContextMyCoreMember();
  const { rank } = member;

  if (!evidence) {
    return false;
  }

  const noMembershipReferenda = !myMembershipReferenda?.length;
  const canNotCreateReferenda = rank < 3;

  return noMembershipReferenda && canNotCreateReferenda;
}

export function useHasCandidateEvidencesTodo() {
  const { members } = useCandidateCoreMembers();
  const { toBeHandled: toBeHandledEvidences } = useTodoEvidences(members);
  return !!toBeHandledEvidences?.length;
}

export function useHasDemotionExpirationTodo() {
  const { members } = useDemotionExpiredMembers();
  return !!members?.length;
}

export function useHasCandidateDemotionExpirationTodo() {
  const { members } = useDemotionExpiredCandidates();
  return !!members?.length;
}

export function useHasMemberEvidencesTodo() {
  const { members } = useNonCandidateCoreMembers();
  const { toBeHandled: toBeHandledEvidences } = useTodoEvidences(members);
  return !!toBeHandledEvidences?.length;
}

export function useHasMyReferendaVotesTodo() {
  const myUnVotedReferenda = useMyUnVotedReferenda();
  return !!myUnVotedReferenda?.length;
}

export function useHasRetentionEvidenceSubmissionTodo() {
  const isDemotionClosing = useIsDemotionClosing();
  const { evidence } = useContextMyEvidence();
  return isDemotionClosing && evidence;
}

export function useHasSalaryPayoutTodo() {
  const salaryStats = useContextSalaryStats();
  const isInPayoutPeriod = useIsSalaryPayoutPeriod(salaryStats);
  const isImported = useIsImported();
  const isSalaryPayout = useIsSalaryPayout();

  return isInPayoutPeriod && isImported && isSalaryPayout;
}

export function useHasSalaryRegistrationTodo() {
  const salaryStats = useContextSalaryStats();
  const isInRegistrationPeriod = useIsInSalaryRegistrationPeriod(salaryStats);
  const isImported = useIsImported();
  const isSalaryRegistered = useIsSalaryRegistered();
  const mySalary = useMySalary();

  return (
    isInRegistrationPeriod && isImported && !isSalaryRegistered && mySalary
  );
}

export default function useHasTodo() {
  const hasMemberReferendaTodo = useHasMemberReferendaTodo();
  const hasCandidateEvidencesTodo = useHasCandidateEvidencesTodo();
  const hasDemotionExpirationTodo = useHasDemotionExpirationTodo();
  const hasCandidateDemotionExpirationTodo =
    useHasCandidateDemotionExpirationTodo();
  const hasMemberEvidencesTodo = useHasMemberEvidencesTodo();
  const hasMyReferendaVotesTodo = useHasMyReferendaVotesTodo();
  const hasRetentionEvidenceSubmissionTodo =
    useHasRetentionEvidenceSubmissionTodo();
  const hasSalaryPayoutTodo = useHasSalaryPayoutTodo();
  const hasSalaryRegistrationTodo = useHasSalaryRegistrationTodo();

  return (
    hasMemberReferendaTodo ||
    hasCandidateEvidencesTodo ||
    hasDemotionExpirationTodo ||
    hasCandidateDemotionExpirationTodo ||
    hasMemberEvidencesTodo ||
    hasMyReferendaVotesTodo ||
    hasRetentionEvidenceSubmissionTodo ||
    hasSalaryPayoutTodo ||
    hasSalaryRegistrationTodo
  );
}
