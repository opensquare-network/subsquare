import pluralize from "pluralize";
import { useTodoEvidences } from "next-common/components/fellowship/core/memberWarnings";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import { useNonCandidateCoreMembers } from "../context/hooks/coreMembers";

export default function MemberEvidencesTodo() {
  const { members } = useNonCandidateCoreMembers();
  const { all: allEvidences, toBeHandled: toBeHandledEvidences } =
    useTodoEvidences(members);

  if (!toBeHandledEvidences?.length) {
    return null;
  }

  const toBeHandledCount = toBeHandledEvidences?.length;
  const total = allEvidences?.length;

  return (
    <TodoWrapper>
      <TodoTag>Membership</TodoTag>
      <TodoContent>
        {toBeHandledCount} member&apos;s&nbsp;
        {pluralize("evidence", toBeHandledCount)} to be handled in total&nbsp;
        <a
          className="text-theme500 cursor-pointer"
          target="_blank"
          rel="noreferrer"
          href="/fellowship/members?evidence_only=true"
        >
          {total} member&apos;s {pluralize("evidence", total)}
        </a>
        .
      </TodoContent>
    </TodoWrapper>
  );
}
