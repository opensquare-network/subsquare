import FellowshipEvidenceMemberStatus from "next-common/components/collectives/core/evidenceMemberStatus";
import FellowshipEvidenceContent from "next-common/components/collectives/core/evidenceContent";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import { useOnchainData } from "next-common/context/post";
import { useReferendumFellowshipCoreEvidence } from "next-common/context/post/fellowship/useReferendumFellowshipCoreEvidence";

function FellowshipReferendaDetailEvidenceImpl() {
  const { wish, evidence, loading } = useReferendumFellowshipCoreEvidence();

  return (
    <div className="mt-4 space-y-4">
      <hr />

      <FellowshipEvidenceMemberStatus />

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
