import DetailItem from "components/detailItem";
import { withLoginUser } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Timeline from "components/publicProposal/timeline";
import Business from "components/publicProposal/business";
import Metadata from "next-common/components/publicProposal/metadata";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Second from "next-common/components/publicProposal/second";
import { useAddressVotingBalance } from "utils/hooks";
import isNil from "lodash.isnil";
import useCommentComponent from "next-common/components/useCommentComponent";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/democracy/publicProposal/checkUnFinalized";
import NonNullPost from "next-common/components/nonNullPost";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import DemocracyPublicProposalCall from "next-common/components/publicProposal/call";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";

function PublicProposalContent({ referendum, comments }) {
  const post = usePost();

  useSubscribePostDetail(post?.proposalIndex);

  const { CommentComponent, focusEditor } = useCommentComponent({
    detail: post,
    comments,
  });

  const publicProposal = post?.onchainData;
  const proposalIndex = publicProposal?.proposalIndex;
  const state = publicProposal?.state?.state;
  const isEnded = ["Tabled", "Canceled", "FastTracked", "Cleared"].includes(
    state,
  );
  const hasTurnIntoReferendum = !isNil(publicProposal.referendumIndex);
  const hasCanceled = ["Canceled", "Cleared"].includes(state);

  const timeline = publicProposal?.timeline;
  const lastTimelineBlockHeight =
    timeline?.[timeline?.length - 1]?.indexer.blockHeight;
  const secondsAtBlockHeight = isEnded
    ? lastTimelineBlockHeight - 1
    : undefined;

  const treasuryProposals = publicProposal?.treasuryProposals;
  const call = publicProposal?.preImage?.call || publicProposal?.call;

  return (
    <>
      <DetailItem onReply={focusEditor} />
      <Second
        proposalIndex={proposalIndex}
        hasTurnIntoReferendum={hasTurnIntoReferendum}
        hasCanceled={hasCanceled}
        useAddressVotingBalance={useAddressVotingBalance}
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

      {CommentComponent}
    </>
  );
}

export default function DemocracyProposalPage({
  id,
  detail,
  referendum,
  comments,
}) {
  let breadcrumbItemName = "";
  let postContent = null;

  if (detail) {
    breadcrumbItemName = `#${detail?.proposalIndex}`;
    postContent = (
      <NonNullPost>
        <PublicProposalContent referendum={referendum} comments={comments} />
      </NonNullPost>
    );
  } else {
    breadcrumbItemName = `#${id}`;
    postContent = <CheckUnFinalized id={id} />;
  }

  const desc = getMetaDesc(detail);

  const breadcrumbItems = [
    {
      content: "Democracy",
    },
    {
      content: "Proposals",
      path: "/democracy/proposals",
    },
    {
      content: breadcrumbItemName,
    },
  ];

  return (
    <PostProvider post={detail}>
      <DetailLayout
        breadcrumbs={breadcrumbItems}
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
        hasSidebar
      >
        {postContent}
      </DetailLayout>
    </PostProvider>
  );
}

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  const { result: detail } = await nextApi.fetch(`democracy/proposals/${id}`);

  if (!detail) {
    return getNullDetailProps(id, { referendum: null });
  }

  let referendum;
  if (!isNil(detail.referendumIndex)) {
    const { result } = await nextApi.fetch(
      `democracy/referendums/${detail.referendumIndex}`,
    );
    referendum = result;
  }

  const comments = await fetchDetailComments(
    `democracy/proposals/${detail._id}/comments`,
    context,
  );

  return {
    props: {
      id,
      detail: detail ?? null,
      referendum: referendum ?? null,
      comments: comments ?? EmptyList,
    },
  };
});
