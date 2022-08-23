/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import Back from "next-common/components/back";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import DetailItem from "components/detailItem";
import Vote from "components/referenda/vote";
import { to404 } from "next-common/utils/serverSideUtil";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Timeline from "components/referenda/timeline";
import ReferendumMetadata from "next-common/components/democracy/metadata";
import useUniversalComments from "components/universalComments";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import useReferendumVoteData from "next-common/utils/hooks/referenda/useReferendumVoteData";

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  const { CommentComponent, focusEditor } = useUniversalComments({
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

  detail.status = detail?.onchainData?.state?.state;

  const desc = getMetaDesc(detail);

  return (
    <DetailWithRightLayout
      user={loginUser}
      seoInfo={{ title: detail?.title, desc, ogImage: detail?.bannerUrl }}
    >
      <Back href={`/democracy/referendums`} text="Back to Referenda" />
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
        proposer={detail?.proposer}
        status={referendumStatus}
        call={detail?.onchainData?.preImage?.call || detail?.onchainData?.call}
        shorten={detail?.onchainData?.preImage?.shorten}
        chain={chain}
        onchainData={detail?.onchainData}
      />

      <Timeline
        timeline={detail?.onchainData?.timeline}
        chain={chain}
        type={detailPageCategory.DEMOCRACY_REFERENDUM}
      />
      {CommentComponent}
    </DetailWithRightLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`democracy/referendums/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  const postId = detail?._id;

  const { result: comments } = await nextApi.fetch(
    `democracy/referendums/${postId}/comments`,
    {
      page: page ?? "last",
      pageSize,
    }
  );

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      chain,
    },
  };
});
