/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import Back from "next-common/components/back";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import DetailItem from "components/detailItem";
import Vote from "components/referenda/vote";
import Timeline from "next-common/components/timeline";
import { to404 } from "next-common/utils/serverSideUtil";
import { getDemocracyTimelineData } from "utils/timeline/democracyUtil";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import ReferendumMetadata from "next-common/components/democracy/metadata";
import useCommentComponent from "next-common/components/useCommentComponent";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import { useReferendumVoteData } from "next-common/components/referenda/hooks";

export default withLoginUserRedux(
  ({ loginUser, detail, publicProposal, comments, chain }) => {
    const { CommentComponent, focusEditor } = useCommentComponent({
      detail,
      comments,
      loginUser,
      chain,
      type: detailPageCategory.DEMOCRACY_REFERENDUM,
    });

    const api = useApi(chain);
    const {
      referendumStatus,
      setReferendumStatus,
      isLoadingReferendumStatus,
      setIsLoadingReferendumStatus,
    } = useReferendumVoteData(detail?.onchainData, api);

    detail.status = detail.onchainData?.state?.state;

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

    const desc = getMetaDesc(detail);
    return (
      <DetailWithRightLayout
        user={loginUser}
        seoInfo={{ title: detail?.title, desc, ogImage: detail?.bannerUrl }}
      >
        <Back href={`/democracy/referendums`} text="Back to Referendas" />
        <DetailItem
          data={detail}
          onReply={focusEditor}
          user={loginUser}
          chain={chain}
          type={detailPageCategory.DEMOCRACY_REFERENDUM}
        />

        <Vote
          referendumInfo={detail?.onchainData?.info}
          referendumStatus={referendumStatus}
          setReferendumStatus={setReferendumStatus}
          chain={chain}
          referendumIndex={detail?.referendumIndex}
          isLoadingReferendumStatus={isLoadingReferendumStatus}
          setIsLoadingReferendumStatus={setIsLoadingReferendumStatus}
        />

        <ReferendumMetadata
          api={api}
          proposer={detail.proposer}
          status={referendumStatus}
          call={detail?.onchainData?.preImage?.call}
          chain={chain}
          onchainData={detail.onchainData}
        />

        <Timeline data={timelineData} chain={chain} />
        {CommentComponent}
      </DetailWithRightLayout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
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
      chain,
    },
  };
});
