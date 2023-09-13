import DetailItem from "components/detailItem";
import { withLoginUser } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Metadata from "next-common/components/publicProposal/metadata";
import DemocracyPublicProposalCall from "next-common/components/publicProposal/call";
import Timeline from "components/publicProposal/timeline";
import Second from "next-common/components/publicProposal/second";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import isNil from "lodash.isnil";
import useUniversalComments from "components/universalComments";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/democracy/publicProposal/checkUnFinalized";
import NonNullPost from "next-common/components/nonNullPost";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

function PublicProposalContent({ comments }) {
  const post = usePost();
  useSubscribePostDetail(post?.proposalIndex);

  const { CommentComponent, focusEditor } = useUniversalComments({
    detail: post,
    comments,
  });

  const publicProposal = post?.onchainData;
  const proposalIndex = publicProposal?.proposalIndex;
  const state = publicProposal?.state?.state;
  const isEnded = ["Tabled", "Canceled", "Cleared"].includes(state);
  const hasTurnIntoReferendum = !isNil(publicProposal.referendumIndex);
  const hasCanceled = ["Canceled", "Cleared"].includes(state);

  const timeline = publicProposal?.timeline;
  const lastTimelineBlockHeight =
    timeline?.[timeline?.length - 1]?.indexer.blockHeight;
  const secondsAtBlockHeight = isEnded
    ? lastTimelineBlockHeight - 1
    : undefined;

  const call = publicProposal?.preImage?.call || publicProposal?.call;

  return (
    <>
      <DetailItem onReply={focusEditor} />
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
      {CommentComponent}
    </>
  );
}

export default function DemocracyProposalPage({ id, detail, comments }) {
  let postContent = null;

  if (detail) {
    postContent = (
      <NonNullPost>
        <PublicProposalContent comments={comments} />
      </NonNullPost>
    );
  } else {
    postContent = <CheckUnFinalized id={id} />;
  }

  const desc = getMetaDesc(detail);

  return (
    <PostProvider post={detail}>
      <DetailLayout
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
