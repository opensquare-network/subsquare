import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Timeline from "components/childBounty/timeline";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Metadata from "next-common/components/treasury/bounty/metadata";
import useUniversalComments from "components/universalComments";
import { NoticeWrapper } from "next-common/components/styled/containers/titleContainer";
import TreasuryCountDown from "next-common/components/treasury/common/countdown";
import { getBannerUrl } from "next-common/utils/banner";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import Claim from "components/childBounty/claim";
import { useCallback } from "react";
import {
  PostProvider,
  usePost,
  usePostDispatch,
} from "next-common/context/post";
import DetailLayout from "next-common/components/layout/DetailLayout";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import { useDetailType } from "next-common/context/page";
import fetchAndUpdatePost from "next-common/context/post/update";
import CheckUnFinalized from "components/childBounty/checkUnFinalized";

const ChildBountyCountDown = ({ data = {} }) => {
  if (data.state?.state !== "PendingPayout") {
    return null;
  }

  const timeline = data.timeline ?? [];
  const awardedItem = [...timeline]
    .reverse()
    .find((item) => item.name === "Awarded");
  if (!awardedItem) {
    return null;
  }

  return (
    <NoticeWrapper>
      <TreasuryCountDown
        startHeight={awardedItem.indexer?.blockHeight}
        targetHeight={data.unlockAt}
        prefix="Claimable"
      />
    </NoticeWrapper>
  );
};

function ChildBountyContent({ comments }) {
  const post = usePost();
  const type = useDetailType();
  const postDispatch = usePostDispatch();

  const { CommentComponent, focusEditor } = useUniversalComments({
    detail: post,
    comments,
  });

  const refreshPageData = useCallback(async () => {
    fetchAndUpdatePost(
      postDispatch,
      type,
      `${post?.parentBountyId}_${post?.index}`
    );
  }, [post, type, postDispatch]);

  const onClaimFinalized = useWaitSyncBlock(
    "Child bounty claimed",
    refreshPageData
  );

  return (
    <>
      <DetailItem
        onReply={focusEditor}
        countDown={<ChildBountyCountDown data={post?.onchainData} />}
      />
      <Claim childBounty={post?.onchainData} onFinalized={onClaimFinalized} />
      <Metadata meta={post?.onchainData?.meta} />
      <Timeline onchainData={post?.onchainData} />
      {CommentComponent}
    </>
  );
}

export default withLoginUserRedux(({ id, detail, comments }) => {
  let breadcrumbItemName = "";
  let postContent = null;

  if (detail) {
    breadcrumbItemName = `#${detail?.index}`;
    postContent = <ChildBountyContent comments={comments} />;
  } else {
    breadcrumbItemName = `Child Bounty #${id}`;
    postContent = <CheckUnFinalized id={id} />;
  }

  const desc = getMetaDesc(detail);

  const showRightSidePanel = ["PendingPayout", "Claimed"].includes(
    detail?.onchainData?.state?.state
  );

  const Layout = showRightSidePanel ? DetailWithRightLayout : DetailLayout;

  const breadcrumbItems = [
    {
      content: "Treasury",
    },
    {
      content: "Child Bounties",
      path: "/treasury/child-bounties",
    },
    {
      content: breadcrumbItemName,
    },
  ];

  return (
    <PostProvider post={detail}>
      <Layout
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
      </Layout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const { result: detail } = await ssrNextApi.fetch(
    `treasury/child-bounties/${id}`
  );

  if (!detail) {
    return {
      props: {
        id,
        detail: null,
        comments: EmptyList,
      },
    };
  }

  const { result: comments } = await ssrNextApi.fetch(
    `treasury/child-bounties/${detail._id}/comments`,
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
