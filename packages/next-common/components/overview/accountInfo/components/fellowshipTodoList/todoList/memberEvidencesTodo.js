import { useEvidencesStat } from "next-common/components/fellowship/core/memberWarnings";
import TodoTag from "./todoTag";
import { useNonCandidateCoreMembers } from "../context/hooks/coreMembers";

export default function MemberEvidencesTodo() {
  const { members } = useNonCandidateCoreMembers();
  const { totalEvidences, evidencesToBeHandled } = useEvidencesStat(members);

  if (!evidencesToBeHandled) {
    return null;
  }

  return (
    <div className="flex items-center">
      <TodoTag>Membership</TodoTag>
      <div className="text-textPrimary text14Medium">
        {evidencesToBeHandled} evidences to be handled in total&nbsp;
        <a
          className="text-theme500 cursor-pointer"
          target="_blank"
          rel="noreferrer"
          href="/fellowship/members?evidence_only=true"
        >
          {totalEvidences} evidences
        </a>
        .
      </div>
    </div>
  );
}
