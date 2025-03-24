import pluralize from "pluralize";
import { useTodoEvidences } from "next-common/components/fellowship/core/memberWarnings";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import { useCandidateCoreMembers } from "../context/hooks/coreMembers";
import { useHasCandidateEvidencesTodo } from "../hooks/useHasTodo";

export default function CandidateEvidencesTodo() {
  const { members } = useCandidateCoreMembers();
  const { all: allEvidences, toBeHandled: toBeHandledEvidences } =
    useTodoEvidences(members);
  const hasTodo = useHasCandidateEvidencesTodo();
  if (!hasTodo) {
    return null;
  }

  const toBeHandledCount = toBeHandledEvidences?.length;
  const total = allEvidences?.length;

  return (
    <TodoWrapper>
      <TodoTag>Membership</TodoTag>
      <TodoContent>
        {toBeHandledCount} candidate&apos;s&nbsp;
        {pluralize("evidence", toBeHandledCount)} to be handled in total&nbsp;
        <a
          className="text-theme500 cursor-pointer"
          target="_blank"
          rel="noreferrer"
          href="/fellowship/members?tab=candidates&evidence_only=true"
        >
          {total} candidate&apos;s {pluralize("evidence", total)}
        </a>
        .
      </TodoContent>
    </TodoWrapper>
  );
}
