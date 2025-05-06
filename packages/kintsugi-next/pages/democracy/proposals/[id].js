import DetailItem from "components/detailItem";
import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Timeline from "components/publicProposal/timeline";
import Business from "components/publicProposal/business";
import Metadata from "next-common/components/publicProposal/metadata";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Second from "next-common/components/publicProposal/second";
import { isNil } from "lodash-es";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/democracy/publicProposal/checkUnFinalized";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import DemocracyPublicProposalCall from "next-common/components/publicProposal/call";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";
import MaybeSimaContent from "next-common/components/detail/maybeSimaContent";

function PublicProposalContent() {
  const post = usePost();
  const { referendum } = usePageProps();

  useSubscribePostDetail(post?.proposalIndex);

  const publicProposal = post?.onchainData;
  const proposalIndex = publicProposal?.proposalIndex;
  const state = publicProposal?.state?.state;
  const isEnded = [
    "Tabled",
    "Canceled",
    "FastTracked",
    "Cleared",
    "Removed",
  ].includes(state);
  const hasTurnIntoReferendum = !isNil(publicProposal.referendumIndex);
  const hasCanceled = ["Canceled", "Cleared", "Removed"].includes(state);

  const timeline = publicProposal?.timeline;
  const lastTimelineBlockHeight =
    timeline?.[timeline?.length - 1]?.indexer.blockHeight;
  const secondsAtBlockHeight = isEnded
    ? lastTimelineBlockHeight - 1
    : undefined;

  const treasuryProposals = publicProposal?.treasuryProposals;
  const call = publicProposal?.preImage?.call || publicProposal?.call;

  return (
    <MaybeSimaContent>
      <ContentWithComment>
        <DetailItem />
        <Second
          proposalIndex={proposalIndex}
          hasTurnIntoReferendum={hasTurnIntoReferendum}
          hasCanceled={hasCanceled}
          atBlockHeight={secondsAtBlockHeight}
        />
        <DetailMultiTabs
          call={
            call && (
              <DemocracyPublicProposalCall
                call={call}
                shorten={publicProposal.preImage?.shorten}
                proposalIndex={publicProposal.proposalIndex}
                referendumIndex={publicProposal.referendumIndex}
              />
            )
          }
          business={
            !!treasuryProposals?.length && (
              <Business treasuryProposals={treasuryProposals} />
            )
          }
          metadata={<Metadata publicProposal={post?.onchainData} />}
          timeline={
            <Timeline
              publicProposalTimeline={post?.onchainData?.timeline}
              referendumTimeline={referendum?.onchainData?.timeline}
            />
          }
        />
      </ContentWithComment>
    </MaybeSimaContent>
  );
}

function PublicProposalContentWithNullGuard() {
  const post = usePost();
  const { id } = usePageProps();

  if (!post) {
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
      <PublicProposalContentWithNullGuard />
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
    return getNullDetailProps(id, { referendum: null });
  }

  let referendum;
  if (!isNil(detail.referendumIndex)) {
    const { result } = await backendApi.fetch(
      `democracy/referendums/${detail.referendumIndex}`,
    );
    referendum = result;
  }

  const comments = await fetchDetailComments(
    `democracy/proposals/${detail._id}/comments`,
    context,
  );

  const { result: summary } = await backendApi.fetch("overview/summary");

  return {
    props: {
      id,
      detail: detail ?? null,
      referendum: referendum ?? null,
      comments: comments ?? EmptyList,
      summary: summary ?? {},
    },
  };
});
