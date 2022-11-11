/* eslint-disable react/jsx-key */
import React, { useCallback, useEffect, useState } from "react";
import Back from "next-common/components/back";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import DetailItem from "components/detailItem";
import Vote from "components/referenda/vote";
import Timeline from "next-common/components/timeline";
import { to404 } from "next-common/utils/serverSideUtil";
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
import { PostProvider } from "next-common/context/post";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import { useDispatch } from "react-redux";
import {
  fetchReferendumStatus,
  fetchVotes,
} from "next-common/store/reducers/referendumSlice";
import { useChain } from "next-common/context/chain";

export default withLoginUserRedux(
  ({ detail: ssrDetail, publicProposal, comments }) => {
    const chain = useChain();
    const [detail, setDetail] = useState(ssrDetail);
    useEffect(() => setDetail(ssrDetail), [ssrDetail]);
    const dispatch = useDispatch();

    const { CommentComponent, focusEditor } = useCommentComponent({
      detail,
      comments,
      type: detailPageCategory.DEMOCRACY_REFERENDUM,
    });

    const api = useApi();
    const { referendumStatus } = useMaybeFetchReferendumStatus(
      detail?.onchainData,
      api
    );
    useMaybeFetchElectorate(detail?.onchainData, api);
    useFetchVotes(detail?.onchainData);

    const proposalData = getDemocracyTimelineData(
      publicProposal?.onchainData?.timeline || [],
      chain,
      detailPageCategory.DEMOCRACY_PROPOSAL
    );
    const referendumData = getDemocracyTimelineData(
      detail?.onchainData?.timeline || [],
      chain,
      detailPageCategory.DEMOCRACY_REFERENDUM
    );
    const timelineData = proposalData.concat(referendumData);

    const refreshPageData = useCallback(async () => {
      const referendumIndex = detail?.onchainData.referendumIndex;
      if (api) {
        dispatch(fetchReferendumStatus(api, referendumIndex));
        dispatch(fetchVotes(api, referendumIndex));
      }
    }, [api, detail, dispatch]);

    const onVoteFinalized = useWaitSyncBlock(
      "Referendum voted",
      refreshPageData
    );

    const desc = getMetaDesc(detail);
    return (
      <PostProvider
        post={detail}
        type={detailPageCategory.DEMOCRACY_REFERENDUM}
      >
        <DetailWithRightLayout
          seoInfo={{
            title: detail?.title,
            desc,
            ogImage: getBannerUrl(detail?.bannerCid),
          }}
        >
          <Back href={`/democracy/referenda`} text="Back to Referenda" />
          <DetailItem
            onReply={focusEditor}
            type={detailPageCategory.DEMOCRACY_REFERENDUM}
          />

          <Vote
            referendumInfo={detail?.onchainData?.info}
            referendumIndex={detail?.referendumIndex}
            onFinalized={onVoteFinalized}
          />

          <ReferendumMetadata
            api={api}
            proposer={detail.proposer}
            status={referendumStatus ?? {}}
            call={detail?.onchainData?.preImage?.call}
            onchainData={detail.onchainData}
          />

          <Timeline data={timelineData} />
          {CommentComponent}
        </DetailWithRightLayout>
      </PostProvider>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`democracy/referendums/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  let publicProposal = null;
  if ((detail.proposalIndex ?? null) !== null) {
    const result = await nextApi.fetch(
      `democracy/proposals/${detail.proposalIndex}`
    );
    publicProposal = result.result;
  }

  const postId = detail?._id;

  const { result: comments } = await nextApi.fetch(
    `democracy/referendums/${postId}/comments`,
    {
      page: page ?? "last",
      pageSize: Math.min(pageSize ?? 50, 100),
    }
  );

  return {
    props: {
      detail: detail ?? {},
      publicProposal,
      comments: comments ?? EmptyList,
    },
  };
});
