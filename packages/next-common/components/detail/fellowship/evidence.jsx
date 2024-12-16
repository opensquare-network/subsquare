import FellowshipEvidenceMemberStatusCard from "next-common/components/collectives/core/evidenceContent/memberStatusCard";
import FellowshipEvidenceContent from "next-common/components/collectives/core/evidenceContent";
import {
  useCoreFellowshipPallet,
  useCoreFellowshipParams,
} from "next-common/context/collectives/collectives";
import { useOnchainData } from "next-common/context/post";
import { useReferendumFellowshipCoreEvidence } from "next-common/context/post/fellowship/useReferendumFellowshipCoreEvidence";
import { useReferendumFellowshipMember } from "next-common/context/post/fellowship/useReferendumFellowshipMember";
import useIsProposalFinished from "next-common/hooks/proposal/useIsProposalFinished";

function FellowshipReferendaDetailEvidenceImpl() {
  const { isLoading, member } = useReferendumFellowshipMember();
  const params = useCoreFellowshipParams();
  const { wish, evidence, loading } = useReferendumFellowshipCoreEvidence();
  const isFinished = useIsProposalFinished();

  return (
    <div className="mt-4 space-y-4">
      <hr />

      <h4 className="text14Bold text-textPrimary">
        Evidence{wish && ` for ${wish}`}
      </h4>

      {!isFinished && (
        <FellowshipEvidenceMemberStatusCard
          isLoading={isLoading}
          member={member}
          params={params}
        />
      )}

      <FellowshipEvidenceContent
        wish={wish}
        evidence={evidence}
        loading={loading}
      />
    </div>
  );
}

export default function FellowshipReferendaDetailEvidence() {
  const pallet = useCoreFellowshipPallet();
  const onchainData = useOnchainData();
  const { call } = onchainData?.inlineCall || onchainData.proposal || {};

  if (
    call?.section === pallet &&
    ["approve", "promote", "promoteFast"].includes(call?.method)
  ) {
    return <FellowshipReferendaDetailEvidenceImpl />;
  }

  return null;
}
