import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Metadata from "next-common/components/publicProposal/metadata";
import Timeline from "components/publicProposal/timeline";
import Second from "next-common/components/publicProposal/second";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import isNil from "lodash.isnil";
import useUniversalComments from "components/universalComments";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import { getBannerUrl } from "next-common/utils/banner";
import {
  PostProvider,
  usePost,
  usePostDispatch,
} from "next-common/context/post";
import { useCallback } from "react";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import { useDetailType } from "next-common/context/page";
import fetchAndUpdatePost from "next-common/context/post/update";
import CheckUnFinalized from "next-common/components/democracy/publicProposal/checkUnFinalized";

function PublicProposalContent({ comments }) {
  const post = usePost();
  const type = useDetailType();
  const postDispatch = usePostDispatch();

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

  const refreshPageData = useCallback(async () => {
    fetchAndUpdatePost(postDispatch, type, post?.proposalIndex);
  }, [post, type, postDispatch]);

  const onSecondFinalized = useWaitSyncBlock(
    "Proposal seconded",
    refreshPageData
  );

  return (
    <>
      <DetailItem onReply={focusEditor} />
      <Second
        proposalIndex={proposalIndex}
        hasTurnIntoReferendum={hasTurnIntoReferendum}
        hasCanceled={hasCanceled}
        useAddressVotingBalance={useAddressBalance}
        atBlockHeight={secondsAtBlockHeight}
        onFinalized={onSecondFinalized}
      />
      <Metadata publicProposal={post?.onchainData} />
      <Timeline />
      {CommentComponent}
    </>
  );
}

export default withLoginUserRedux(({ id, detail, comments }) => {
  let breadcrumbItemName = "";
  let postContent = null;

  if (detail) {
    breadcrumbItemName = `#${detail?.proposalIndex}`;
    postContent = <PublicProposalContent comments={comments} />;
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
      <DetailWithRightLayout
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        <BreadcrumbWrapper>
          <Breadcrumb items={breadcrumbItems} />
        </BreadcrumbWrapper>

        {postContent}
      </DetailWithRightLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const { result: detail } = await nextApi.fetch(`democracy/proposals/${id}`);

  if (!detail) {
    return {
      props: {
        id,
        detail: null,
        comments: EmptyList,
      },
    };
  }

  const { result: comments } = await nextApi.fetch(
    `democracy/proposals/${detail._id}/comments`,
    {
      page: page ?? "last",
      pageSize,
    }
  );

  return {
    props: {
      id,
      detail,
      comments: comments ?? EmptyList,
    },
  };
});
