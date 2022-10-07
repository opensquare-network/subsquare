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
import useMaybeFetchReferendumStatus from "next-common/utils/hooks/referenda/useMaybeFetchReferendumStatus";
import useMaybeFetchElectorate from "next-common/utils/hooks/referenda/useMaybeFetchElectorate";
import useFetchVotes from "next-common/utils/hooks/referenda/useFetchVotes";
import { getBannerUrl } from "next-common/utils/banner";

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
    const { referendumStatus } = useMaybeFetchReferendumStatus(
      detail?.onchainData,
      api
    );
    useMaybeFetchElectorate(detail?.onchainData, api);
    useFetchVotes(detail?.onchainData, api);

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
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        <Back href={`/democracy/referenda`} text="Back to Referenda" />
        <DetailItem
          data={detail}
          onReply={focusEditor}
          user={loginUser}
          chain={chain}
          type={detailPageCategory.DEMOCRACY_REFERENDUM}
        />

        <Vote
          referendumInfo={detail?.onchainData?.info}
          chain={chain}
          referendumIndex={detail?.referendumIndex}
        />

        <ReferendumMetadata
          api={api}
          proposer={detail.proposer}
          status={referendumStatus ?? {}}
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
      redux: {
        detail,
        detailType: detailPageCategory.DEMOCRACY_REFERENDUM
      },
    },
  };
});
