import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  getFellowshipReferendumCommentsUrl,
  getFellowshipReferendumUrl,
} from "next-common/services/url";
import { EmptyList } from "next-common/utils/constants";
import {
  PostProvider,
  usePost,
  usePostDispatch,
} from "next-common/context/post";
import { getBannerUrl } from "next-common/utils/banner";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import FellowshipBreadcrumb from "next-common/components/fellowship/breadcrumb";
import DetailItem from "../../../components/detailItem";
import useUniversalComments from "../../../components/universalComments";
import Gov2ReferendumMetadata from "next-common/components/gov2/referendum/metadata";
import Timeline from "../../../components/gov2/timeline";
import FellowshipReferendumSideBar from "../../../components/fellowship/referendum/sidebar";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import { useCallback } from "react";
import { useDetailType } from "next-common/context/page";
import fetchAndUpdatePost from "next-common/context/post/update";
import CheckUnFinalized from "components/fellowship/checkUnFinalized";
import BreadcrumbWrapper, {
  BreadcrumbHideOnMobileText,
} from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";

function FellowshipContent({ comments }) {
  const post = usePost();
  const type = useDetailType();
  const postDispatch = usePostDispatch();

  const { CommentComponent, focusEditor } = useUniversalComments({
    detail: post,
    comments,
  });

  const refreshPageData = useCallback(async () => {
    fetchAndUpdatePost(postDispatch, type, post?._id);
  }, [post, type, postDispatch]);

  const onVoteFinalized = useWaitSyncBlock(
    "Fellowship referendum voted",
    refreshPageData
  );

  return (
    <>
      <DetailItem onReply={focusEditor} />

      <FellowshipReferendumSideBar onVoteFinalized={onVoteFinalized} />

      <Gov2ReferendumMetadata detail={post} />
      <Timeline trackInfo={post?.onchainData?.trackInfo} />
      {CommentComponent}
    </>
  );
}

function UnFinalizedBreadcrumb({ id }) {
  return (
    <BreadcrumbWrapper>
      <Breadcrumb
        items={[
          {
            path: "/fellowship",
            content: "Fellowship",
          },
          {
            content: (
              <>
                <BreadcrumbHideOnMobileText>
                  Referendum
                </BreadcrumbHideOnMobileText>{" "}
                {`#${id}`}
              </>
            ),
          },
        ]}
      />
    </BreadcrumbWrapper>
  );
}

export default withLoginUserRedux(({ id, detail, comments }) => {
  let postContent = null;
  let breadcrumb = null;

  if (detail) {
    postContent = <FellowshipContent comments={comments} />;
    breadcrumb = <FellowshipBreadcrumb />;
  } else {
    postContent = <CheckUnFinalized id={id} />;
    breadcrumb = <UnFinalizedBreadcrumb id={id} />;
  }

  return (
    <PostProvider post={detail}>
      <DetailWithRightLayout
        seoInfo={{
          title: detail?.title,
          desc: getMetaDesc(detail),
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        {breadcrumb}
        {postContent}
      </DetailWithRightLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const { result: detail } = await ssrNextApi.fetch(
    getFellowshipReferendumUrl(id)
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

  const postId = detail?._id;
  const { result: comments } = await ssrNextApi.fetch(
    getFellowshipReferendumCommentsUrl(postId),
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
