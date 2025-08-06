import EvidenceLayout from "next-common/components/layout/evidenceLayout";
import { usePageProps } from "next-common/context/page";
import { WishBar } from "./fellowshipMember/wishBar";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { PostProvider } from "next-common/context/post";
import ArticleActions from "next-common/components/actions/articleActions";
import PostMetaBase from "next-common/components/detail/container/postMeta/metaBase";
import { CommentsContent } from "next-common/components/detail/container/postMeta/comments";
import Divider from "next-common/components/styled/layout/divider";
import { SimpleTime } from "next-common/components/postList/common/postItemTime";
import EvidenceRelatedReferenda from "./evidenceRelatedReferenda";
import DirectEvidenceContent from "next-common/components/fellowship/evidences/directEvidenceContent";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import { useReferendumFellowshipCoreEvidenceForWho } from "next-common/context/post/fellowship/useReferendumFellowshipCoreEvidence";
import FellowshipEvidenceContent from "next-common/components/collectives/core/evidenceContent";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function EvidencePage(props) {
  return (
    <PostProvider post={props.detail}>
      <EvidenceLayout
        seoInfo={{
          title: props.detail?.title,
          desc: props.detail?.title,
        }}
      >
        <ContentWithComment>
          <EvidencePageImpl />
        </ContentWithComment>
      </EvidenceLayout>
    </PostProvider>
  );
}

function OnChainEvidenceImpl() {
  const { who } = usePageProps() || {};
  const { wish, evidence, loading } =
    useReferendumFellowshipCoreEvidenceForWho(who);

  return (
    <FellowshipEvidenceContent
      wish={wish}
      evidence={evidence}
      loading={loading}
    />
  );
}

function EvidenceContentOnChain() {
  const { detail } = usePageProps() || {};

  if (!detail?.indexer) {
    return null;
  }

  return (
    <MigrationConditionalApiProvider indexer={detail?.indexer}>
      <CollectivesProvider section="fellowship">
        <OnChainEvidenceImpl />
      </CollectivesProvider>
    </MigrationConditionalApiProvider>
  );
}

function EvidenceContentContainer() {
  const { detail } = usePageProps() || {};

  if (detail?.cid || detail?.content || detail?.hex) {
    return (
      <DirectEvidenceContent
        cid={detail?.cid}
        content={detail?.content}
        hex={detail?.hex}
      />
    );
  }

  return <EvidenceContentOnChain />;
}

function EvidencePageContent() {
  return (
    <div>
      <EvidenceContentContainer />
      <ArticleActions editable={false} />
      <EvidenceRelatedReferenda />
    </div>
  );
}

function EvidencePageImpl() {
  const { detail, comments } = usePageProps() || {};

  if (!detail) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-6">
      <WishBar wish={detail.wish} rank={detail.rank} address={detail.who} />
      <PostMetaBase>
        <SimpleTime timestamp={detail.indexer?.blockTime} />
        <CommentsContent commentsCount={comments?.total || 0} />
      </PostMetaBase>
      <Divider />
      <EvidencePageContent />
    </div>
  );
}
