import FellowshipEvidenceContent from "next-common/components/collectives/core/evidenceContent";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import { useOnchainData } from "next-common/context/post";
import { usePageProps } from "next-common/context/page";
import { useReferendumFellowshipCoreEvidence } from "next-common/context/post/fellowship/useReferendumFellowshipCoreEvidence";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import EvidenceContentWithMemberStatusCard from "./evidenceContentWithMemberStatusCard";
import { FellowshipEvidenceContentFromApi } from "./fellowshipEvidenceContentFromApi";

function FellowshipReferendaDetailEvidenceImpl() {
  const { wish, evidence, loading } = useReferendumFellowshipCoreEvidence();

  return (
    <EvidenceContentWithMemberStatusCard>
      <FellowshipEvidenceContent
        wish={wish}
        evidence={evidence}
        loading={loading}
      />
    </EvidenceContentWithMemberStatusCard>
  );
}

export default function FellowshipReferendaDetailEvidence() {
  const pallet = useCoreFellowshipPallet();
  const onchainData = useOnchainData();
  const { evidence } = usePageProps();
  const { call } = onchainData?.inlineCall || onchainData.proposal || {};
  const indexer = useReferendumVotingFinishIndexer();

  if (evidence?.cid || evidence?.content) {
    return <FellowshipEvidenceContentFromApi evidence={evidence} />;
  }

  if (
    call?.section === pallet &&
    ["approve", "promote", "promoteFast"].includes(call?.method)
  ) {
    return (
      <MigrationConditionalApiProvider indexer={indexer}>
        <FellowshipReferendaDetailEvidenceImpl />
      </MigrationConditionalApiProvider>
    );
  }

  return null;
}
