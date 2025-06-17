import DetailItem from "next-common/components/pages/components/detailItem";
import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Second from "next-common/components/publicProposal/second";
import { isNil } from "lodash-es";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/democracy/publicProposal/checkUnFinalized";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";
import useIsDemocracyProposalFinished from "next-common/hooks/democracy/proposal/useIsDemocracyProposalFinished";
import MaybeSimaContent from "next-common/components/detail/maybeSimaContent";
import DemocracyPublicProposalsDetailMultiTabs from "next-common/components/pages/components/tabs/democracyPublicProposalsDetailMultiTabs";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";

function PublicProposalContent() {
  const post = usePost();

  useSubscribePostDetail(post?.proposalIndex);

  const publicProposal = post?.onchainData;
  const proposalIndex = publicProposal?.proposalIndex;
  const state = publicProposal?.state?.state;
  const isEnded = useIsDemocracyProposalFinished();
  const hasTurnIntoReferendum = !isNil(publicProposal.referendumIndex);
  const hasCanceled = ["Canceled", "Cleared", "Removed"].includes(state);

  const timeline = publicProposal?.timeline;
  const indexer = timeline?.[timeline?.length - 1]?.indexer || {};
  const blockTime = useSelector(blockTimeSelector);

  const lastIndexer = isEnded
    ? {
        blockTime: indexer?.blockTime - blockTime,
        blockHeight: indexer?.blockHeight - 1,
      }
    : null;

  return (
    <MaybeSimaContent>
      <ContentWithComment>
        <DetailItem />
        <MigrationConditionalApiProvider indexer={lastIndexer}>
          <Second
            proposalIndex={proposalIndex}
            hasTurnIntoReferendum={hasTurnIntoReferendum}
            hasCanceled={hasCanceled}
          />
        </MigrationConditionalApiProvider>
        <DemocracyPublicProposalsDetailMultiTabs />
      </ContentWithComment>
    </MaybeSimaContent>
  );
}

function DemocracyProposalContentWithNullGuard() {
  const detail = usePost();
  const { id } = usePageProps();

  if (!detail) {
    return <CheckUnFinalized id={id} />;
  }

  return <PublicProposalContent />;
}

function DemocracyProposalPageImpl() {
  const detail = usePost();
  const desc = getMetaDesc(detail);

  return (
    <DetailLayout
      seoInfo={{
        title: detail?.title,
        desc,
        ogImage: getBannerUrl(detail?.bannerCid),
      }}
      hasSidebar
    >
      <DemocracyProposalContentWithNullGuard />
    </DetailLayout>
  );
}

export default function DemocracyProposalPage({ detail }) {
  return (
    <PostProvider post={detail}>
      <DemocracyProposalPageImpl />
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const { result: detail } = await backendApi.fetch(
    `democracy/proposals/${id}`,
  );

  if (!detail) {
    return getNullDetailProps(id);
  }

  const comments = await fetchDetailComments(
    `democracy/proposals/${detail._id}/comments`,
    context,
  );

  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      ...tracksProps,
    },
  };
});
