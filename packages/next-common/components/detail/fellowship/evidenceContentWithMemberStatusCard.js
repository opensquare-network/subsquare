import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import { useReferendumFellowshipMember } from "next-common/context/post/fellowship/useReferendumFellowshipMember";
import useIsProposalFinished from "next-common/hooks/proposal/useIsProposalFinished";
import FellowshipEvidenceMemberStatusCard from "next-common/components/collectives/core/evidenceContent/memberStatusCard";

export default function EvidenceContentWithMemberStatusCard({ children }) {
  const { isLoading, member } = useReferendumFellowshipMember();
  const params = useCoreFellowshipParams();
  const isFinished = useIsProposalFinished();

  return (
    <div className="mt-4 space-y-4">
      <hr />
      {!isFinished && (
        <FellowshipEvidenceMemberStatusCard
          isLoading={isLoading}
          member={member}
          params={params}
        />
      )}
      {children}
    </div>
  );
}
