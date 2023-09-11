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
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/democracy/referendum/checkUnFinalized";
import NonNullPost from "next-common/components/nonNullPost";
import DemocracyReferendaDetail from "next-common/components/detail/Democracy/referendum";
import DetailLayout from "next-common/components/layout/DetailLayout";
import useDemocracyVotesFromServer from "next-common/utils/hooks/referenda/useDemocracyVotesFromServer";
import { clearVotes } from "next-common/store/reducers/democracy/votes";
import { useDispatch } from "react-redux";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import ReferendumCall from "next-common/components/democracy/call";
import useInlineCall from "next-common/components/democracy/metadata/useInlineCall";
import DemocracyReferendaVotesBubble from "next-common/components/democracy/referendum/votesBubble";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

function ReferendumContent({ comments }) {
  const post = usePost();
  const onchainData = post?.onchainData;
  const dispatch = useDispatch();

  const { timeline = [], preImage } = onchainData;

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
  const proposal = referendumStatus?.proposal;

  const { call: inlineCall } = useInlineCall(timeline, proposal);
  const call = preImage?.call || inlineCall;

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

      <DetailMultiTabs
        call={
          (call || inlineCall) && (
            <ReferendumCall
              call={call || inlineCall}
              shorten={post?.onchainData?.preImage?.shorten}
              onchainData={post?.onchainData}
            />
          )
        }
        metadata={
          <ReferendumMetadata
            proposer={post?.proposer}
            status={referendumStatus ?? {}}
            call={post?.onchainData?.preImage?.call || post?.onchainData?.call}
            shorten={post?.onchainData?.preImage?.shorten}
            onchainData={post?.onchainData}
          />
        }
        timeline={<Timeline />}
        votesBubble={<DemocracyReferendaVotesBubble />}
      />

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
      <DetailLayout seoInfo={seoInfo} breadcrumbs={breadcrumbItems} hasSidebar>
        {postContent}
      </DetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  const { result: detail } = await nextApi.fetch(`democracy/referendums/${id}`);
  if (!detail) {
    return getNullDetailProps(id);
  }

  const comments = await fetchDetailComments(
    `democracy/referendums/${detail?._id}/comments`,
    context,
  );
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      id,
      detail,
      comments: comments ?? EmptyList,

      ...tracksProps,
    },
  };
});
