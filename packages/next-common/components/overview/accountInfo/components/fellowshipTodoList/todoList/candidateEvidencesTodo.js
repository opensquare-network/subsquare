import { useTodoEvidences } from "next-common/components/fellowship/core/memberWarnings";
import TodoTag from "./todoTag";
import { useCandidateCoreMembers } from "../context/hooks/coreMembers";
import pluralize from "pluralize";

export default function CandidateEvidencesTodo() {
  const { members } = useCandidateCoreMembers();
  const { all: allEvidences, toBeHandled: toBeHandledEvidences } =
    useTodoEvidences(members);

  const toBeHandledCount = toBeHandledEvidences?.length;
  const total = allEvidences?.length;

  if (!toBeHandledCount) {
    return null;
  }

  return (
    <div className="flex items-center">
      <TodoTag>Membership</TodoTag>
      <div className="text-textPrimary text14Medium">
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
      </div>
    </div>
  );
}
