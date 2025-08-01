import FellowshipEvidenceMemberStatusCard from "next-common/components/collectives/core/evidenceContent/memberStatusCard";
import FellowshipEvidenceContent from "next-common/components/collectives/core/evidenceContent";
import {
  useCoreFellowshipPallet,
  useCoreFellowshipParams,
} from "next-common/context/collectives/collectives";
import { useOnchainData } from "next-common/context/post";
import { MarkdownPreviewer } from "@osn/previewer";
import { usePageProps } from "next-common/context/page";
import { useReferendumFellowshipCoreEvidence } from "next-common/context/post/fellowship/useReferendumFellowshipCoreEvidence";
import { useReferendumFellowshipMember } from "next-common/context/post/fellowship/useReferendumFellowshipMember";
import useIsProposalFinished from "next-common/hooks/proposal/useIsProposalFinished";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import EvidenceExternalLinkWithWish from "next-common/components/collectives/core/evidenceContent/EvidenceExternalLinkWithWish";
import { isObject } from "lodash-es";

function FellowshipReferendaDetailEvidenceContent({ children }) {
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

function FellowshipReferendaDetailEvidenceImpl() {
  const { wish, evidence, loading } = useReferendumFellowshipCoreEvidence();

  return (
    <FellowshipReferendaDetailEvidenceContent>
      <FellowshipEvidenceContent
        wish={wish}
        evidence={evidence}
        loading={loading}
      />
    </FellowshipReferendaDetailEvidenceContent>
  );
}

function FellowshipEvidenceContentFromApi({ evidence }) {
  return (
    <FellowshipReferendaDetailEvidenceContent>
      <EvidenceExternalLinkWithWish
        cid={evidence?.cid}
        wish={evidence?.wish}
        evidence={evidence?.hex}
      />
      <MarkdownPreviewer content={evidence?.content} />
    </FellowshipReferendaDetailEvidenceContent>
  );
}

export default function FellowshipReferendaDetailEvidence() {
  const pallet = useCoreFellowshipPallet();
  const onchainData = useOnchainData();
  const { evidence } = usePageProps();
  const { call } = onchainData?.inlineCall || onchainData.proposal || {};
  const indexer = useReferendumVotingFinishIndexer();

  if (isObject(evidence)) {
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
