import FellowshipEvidenceContent from "next-common/components/collectives/core/evidenceContent";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import { useOnchainData } from "next-common/context/post";
import { usePageProps } from "next-common/context/page";
import { useReferendumFellowshipCoreEvidence } from "next-common/context/post/fellowship/useReferendumFellowshipCoreEvidence";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import EvidenceContentWithMemberStatusCard from "./evidenceContentWithMemberStatusCard";
import EvidenceExternalLinkWithWish from "next-common/components/collectives/core/evidenceContent/EvidenceExternalLinkWithWish";
import DirectEvidenceContent from "next-common/components/fellowship/evidences/directEvidenceContent";

function OnChainEvidenceImpl() {
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

function EvidenceContentFromApi({ evidence }) {
  return (
    <EvidenceContentWithMemberStatusCard>
      <EvidenceExternalLinkWithWish
        cid={evidence?.cid}
        wish={evidence?.wish}
        evidence={evidence?.hex}
      />
      <DirectEvidenceContent
        content={evidence?.content}
        cid={evidence?.cid}
        hex={evidence?.hex}
      />
    </EvidenceContentWithMemberStatusCard>
  );
}

function EvidenceContentOnChain() {
  const pallet = useCoreFellowshipPallet();
  const onchainData = useOnchainData();
  const { call } = onchainData?.inlineCall || onchainData.proposal || {};
  const indexer = useReferendumVotingFinishIndexer();

  if (
    call?.section === pallet &&
    ["approve", "promote", "promoteFast"].includes(call?.method)
  ) {
    return (
      <MigrationConditionalApiProvider indexer={indexer}>
        <OnChainEvidenceImpl />
      </MigrationConditionalApiProvider>
    );
  }
  return null;
}

export default function FellowshipReferendaDetailEvidence() {
  const { evidence } = usePageProps();

  if (evidence?.cid || evidence?.content || evidence?.hex) {
    return <EvidenceContentFromApi evidence={evidence} />;
  }

  return <EvidenceContentOnChain />;
}
