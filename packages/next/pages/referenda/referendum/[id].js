import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import {
  PostProvider,
  usePost,
  usePostDispatch,
} from "next-common/context/post";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import Gov2Sidebar from "components/gov2/sidebar";
import { ssrNextApi } from "next-common/services/nextApi";
import useUniversalComments from "components/universalComments";
import {
  gov2ReferendumsCommentApi,
  gov2ReferendumsDetailApi,
  gov2ReferendumsVoteStatsApi,
} from "next-common/services/url";
import Timeline from "components/gov2/timeline";
import Gov2ReferendumMetadata from "next-common/components/gov2/referendum/metadata";
import { useCallback, useEffect } from "react";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import { EmptyList } from "next-common/utils/constants";
import Breadcrumb from "next-common/components/_Breadcrumb";
import ReferendaBusiness from "../../../components/gov2/business";
import { unsetIssuance } from "next-common/store/reducers/gov2ReferendumSlice";
import { useDispatch } from "react-redux";
import BreadcrumbWrapper, {
  BreadcrumbHideOnMobileText,
} from "next-common/components/detail/common/BreadcrumbWrapper";
import { useDetailType } from "next-common/context/page";
import fetchAndUpdatePost from "next-common/context/post/update";
import CheckUnFinalized from "components/gov2/checkUnFinalized";
import ReferendaBreadcrumb from "next-common/components/referenda/breadcrumb";
import NonNullPost from "next-common/components/nonNullPost";
import ReferendaDetail from "next-common/components/detail/referenda";

function ReferendumContent({ comments }) {
  const post = usePost();
  const type = useDetailType();
  const postDispatch = usePostDispatch();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(unsetIssuance());
    };
  }, [dispatch]);

  const { CommentComponent, focusEditor } = useUniversalComments({
    detail: post,
    comments,
  });

  const refreshPageData = useCallback(async () => {
    fetchAndUpdatePost(postDispatch, type, post?._id);
  }, [post, type, postDispatch]);

  const onVoteFinalized = useWaitSyncBlock("Referendum voted", refreshPageData);
  const onDecisionDepositFinalized = useWaitSyncBlock(
    "Decision deposit placed",
    refreshPageData,
  );

  return (
    <>
      <ReferendaDetail onReply={focusEditor} />

      <Gov2Sidebar
        onVoteFinalized={onVoteFinalized}
        onDecisionDepositFinalized={onDecisionDepositFinalized}
      />

      <ReferendaBusiness />
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
            path: "/referenda",
            content: "Referenda",
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
  let postContent;

  if (detail) {
    postContent = (
      <NonNullPost>
        <ReferendaBreadcrumb />
        <ReferendumContent comments={comments} />
      </NonNullPost>
    );
  } else {
    postContent = (
      <>
        <UnFinalizedBreadcrumb id={id} />
        <CheckUnFinalized id={id} />
      </>
    );
  }

  const desc = getMetaDesc(detail);

  return (
    <PostProvider post={detail}>
      <DetailWithRightLayout
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        {postContent}
      </DetailWithRightLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const { result: detail } = await ssrNextApi.fetch(
    gov2ReferendumsDetailApi(id),
  );

  if (!detail) {
    return {
      props: {
        id,
        detail: null,
        voteStats: {},
        comments: EmptyList,
      },
    };
  }

  const { result: voteStats } = await ssrNextApi.fetch(
    gov2ReferendumsVoteStatsApi(id),
  );

  const postId = detail?._id;
  const { result: comments } = await ssrNextApi.fetch(
    gov2ReferendumsCommentApi(postId),
    {
      page: page ?? "last",
      pageSize,
    },
  );

  return {
    props: {
      id,
      detail,
      voteStats: voteStats ?? {},
      comments: comments ?? EmptyList,
    },
  };
});
