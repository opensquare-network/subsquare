import React, { useCallback } from "react";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import DetailItem from "components/detailItem";
import Vote from "components/referenda/vote";
import Timeline from "next-common/components/timeline";
import { getDemocracyTimelineData } from "utils/timeline/democracyUtil";
import useApi from "next-common/utils/hooks/useApi";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import ReferendumMetadata from "next-common/components/democracy/metadata";
import useCommentComponent from "next-common/components/useCommentComponent";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import useMaybeFetchReferendumStatus from "next-common/utils/hooks/referenda/useMaybeFetchReferendumStatus";
import useMaybeFetchElectorate from "next-common/utils/hooks/referenda/useMaybeFetchElectorate";
import useFetchVotes from "next-common/utils/hooks/referenda/useFetchVotes";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import { useDispatch } from "react-redux";
import {
  fetchReferendumStatus,
  fetchVotes,
} from "next-common/store/reducers/referendumSlice";
import Breadcrumb from "next-common/components/_Breadcrumb";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import isNil from "lodash.isnil";
import CheckUnFinalized from "next-common/components/democracy/referendum/checkUnFinalized";

function ReferendumContent({ publicProposal, comments }) {
  const dispatch = useDispatch();
  const post = usePost();

  const { CommentComponent, focusEditor } = useCommentComponent({
    detail: post,
    comments,
  });

  const api = useApi();
  const { referendumStatus } = useMaybeFetchReferendumStatus(
    post?.onchainData,
    api
  );
  useMaybeFetchElectorate(post?.onchainData, api);
  useFetchVotes(post?.onchainData);

  const proposalData = getDemocracyTimelineData(
    publicProposal?.onchainData?.timeline || [],
    detailPageCategory.DEMOCRACY_PROPOSAL
  );
  const referendumData = getDemocracyTimelineData(
    post?.onchainData?.timeline || [],
    detailPageCategory.DEMOCRACY_REFERENDUM
  );
  const timelineData = proposalData.concat(referendumData);

  const refreshPageData = useCallback(async () => {
    const referendumIndex = post?.onchainData.referendumIndex;
    if (api) {
      dispatch(fetchReferendumStatus(api, referendumIndex));
      dispatch(fetchVotes(api, referendumIndex));
    }
  }, [api, post, dispatch]);

  const onVoteFinalized = useWaitSyncBlock("Referendum voted", refreshPageData);

  return (
    <>
      <DetailItem onReply={focusEditor} />

      <Vote
        referendumInfo={post?.onchainData?.info}
        referendumIndex={post?.referendumIndex}
        onFinalized={onVoteFinalized}
      />

      <ReferendumMetadata
        proposer={post?.proposer}
        status={referendumStatus ?? {}}
        call={post?.onchainData?.preImage?.call}
        onchainData={post?.onchainData}
      />

      <Timeline data={timelineData} />
      {CommentComponent}
    </>
  );
}

export default withLoginUserRedux(
  ({ id, detail, publicProposal, comments }) => {
    let breadcrumbItemName = "";
    let postContent = null;

    if (detail) {
      breadcrumbItemName = `#${detail?.referendumIndex}`;
      postContent = (
        <ReferendumContent
          publicProposal={publicProposal}
          comments={comments}
        />
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
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size: pageSize } = context.query;

  const { result: detail } = await nextApi.fetch(`democracy/referendums/${id}`);

  if (!detail) {
    return {
      props: {
        id,
        detail: null,
        publicProposal: null,
        comments: EmptyList,
      },
    };
  }

  let publicProposal;
  if (!isNil(detail.proposalIndex)) {
    const { result } = await nextApi.fetch(
      `democracy/proposals/${detail.proposalIndex}`
    );
    publicProposal = result;
  }

  const { result: comments } = await nextApi.fetch(
    `democracy/referendums/${detail?._id}/comments`,
    {
      page: page ?? "last",
      pageSize: Math.min(pageSize ?? 50, 100),
    }
  );

  return {
    props: {
      id,
      detail: detail ?? null,
      publicProposal: publicProposal ?? null,
      comments: comments ?? EmptyList,
    },
  };
});
