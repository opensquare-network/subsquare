import DetailItem from "components/detailItem";
import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Second from "next-common/components/publicProposal/second";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import { isNil } from "lodash-es";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/democracy/publicProposal/checkUnFinalized";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";
import useIsDemocracyProposalFinished from "next-common/hooks/democracy/proposal/useIsDemocracyProposalFinished";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import MaybeSimaContent from "next-common/components/detail/maybeSimaContent";

const Metadata = dynamicClientOnly(() =>
  import("next-common/components/publicProposal/metadata"),
);
const DemocracyPublicProposalCall = dynamicClientOnly(() =>
  import("next-common/components/publicProposal/call"),
);
const Timeline = dynamicClientOnly(() =>
  import("components/publicProposal/timeline"),
);

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
  const lastTimelineBlockHeight =
    timeline?.[timeline?.length - 1]?.indexer.blockHeight;
  const secondsAtBlockHeight = isEnded
    ? lastTimelineBlockHeight - 1
    : undefined;

  const call = publicProposal?.preImage?.call || publicProposal?.call;

  return (
    <MaybeSimaContent>
      <ContentWithComment>
        <DetailItem />
        <Second
          proposalIndex={proposalIndex}
          hasTurnIntoReferendum={hasTurnIntoReferendum}
          hasCanceled={hasCanceled}
          useAddressVotingBalance={useAddressBalance}
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
          metadata={<Metadata publicProposal={post?.onchainData} />}
          timeline={<Timeline />}
        />
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
  const { result: detail } = await nextApi.fetch(`democracy/proposals/${id}`);

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
