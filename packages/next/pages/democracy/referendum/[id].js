import React, { useEffect } from "react";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Vote from "components/referenda/vote";
import useApi from "next-common/utils/hooks/useApi";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Timeline from "components/referenda/timeline";
import ReferendumMetadata from "next-common/components/democracy/metadata";
import useUniversalComments from "components/universalComments";
import useMaybeFetchReferendumStatus from "next-common/utils/hooks/referenda/useMaybeFetchReferendumStatus";
import useMaybeFetchElectorate from "next-common/utils/hooks/referenda/useMaybeFetchElectorate";
import useFetchVotes from "next-common/utils/hooks/referenda/useFetchVotes";
import { getBannerUrl } from "next-common/utils/banner";
import {
  PostProvider,
  usePost,
  usePostDispatch,
} from "next-common/context/post";
import { useDetailType } from "next-common/context/page";
import CheckUnFinalized from "next-common/components/democracy/referendum/checkUnFinalized";
import NonNullPost from "next-common/components/nonNullPost";
import DemocracyReferendaDetail from "next-common/components/detail/Democracy/referendum";
import DemocracyReferendaDetailLayout from "next-common/components/layout/democracyLayout/referendaDetail";
import useDemocracyVotesFromServer from "next-common/utils/hooks/referenda/useDemocracyVotesFromServer";
import { clearVotes } from "next-common/store/reducers/democracy/votes";
import { useDispatch } from "react-redux";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";

function ReferendumContent({ comments }) {
  const post = usePost();
  const type = useDetailType();
  const postDispatch = usePostDispatch();
  const dispatch = useDispatch();

  useSubscribePostDetail(post?.referendumIndex);

  const { CommentComponent, focusEditor } = useUniversalComments({
    detail: post,
    comments,
  });

  const api = useApi();
  const { referendumStatus } = useMaybeFetchReferendumStatus(
    post?.onchainData,
    api,
  );
  useMaybeFetchElectorate(post?.onchainData, api);
  useDemocracyVotesFromServer(post.referendumIndex);
  useFetchVotes(post?.onchainData);

  useEffect(() => {
    return () => {
      dispatch(clearVotes());
    };
  }, [dispatch]);

  return (
    <>
      <DemocracyReferendaDetail onReply={focusEditor} />

      <Vote referendumIndex={post?.referendumIndex} />

      <ReferendumMetadata
        proposer={post?.proposer}
        status={referendumStatus ?? {}}
        call={post?.onchainData?.preImage?.call || post?.onchainData?.call}
        shorten={post?.onchainData?.preImage?.shorten}
        onchainData={post?.onchainData}
      />

      <Timeline />
      {CommentComponent}
    </>
  );
}

export default withLoginUserRedux(({ id, detail, comments }) => {
  let breadcrumbItemName = "";
  let postContent = null;

  if (detail) {
    breadcrumbItemName = `#${detail?.referendumIndex}`;
    postContent = (
      <NonNullPost>
        <ReferendumContent comments={comments} />
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
      content: "Referenda",
      path: "/democracy/referenda",
    },
    {
      content: breadcrumbItemName,
    },
  ];

  const seoInfo = {
    title: detail?.title,
    desc,
    ogImage: getBannerUrl(detail?.bannerCid),
  };

  return (
    <PostProvider post={detail}>
      <DemocracyReferendaDetailLayout
        detail={detail}
        seoInfo={seoInfo}
        breadcrumbs={breadcrumbItems}
        hasSider
      >
        {postContent}
      </DemocracyReferendaDetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const { result: detail } = await nextApi.fetch(`democracy/referendums/${id}`);

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
    `democracy/referendums/${detail?._id}/comments`,
    {
      page: page ?? "last",
      pageSize,
    },
  );

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      id,
      detail,
      comments: comments ?? EmptyList,

      tracks,
      fellowshipTracks,
    },
  };
});
