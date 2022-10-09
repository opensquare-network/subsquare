/* eslint-disable react/jsx-key */
import React from "react";
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
import useMaybeFetchReferendumStatus from "next-common/utils/hooks/referenda/useMaybeFetchReferendumStatus";
import useMaybeFetchElectorate from "next-common/utils/hooks/referenda/useMaybeFetchElectorate";
import useFetchVotes from "next-common/utils/hooks/referenda/useFetchVotes";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  const { CommentComponent, focusEditor } = useUniversalComments({
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

  const desc = getMetaDesc(detail);

  return (
    <PostProvider post={detail} type={detailPageCategory.DEMOCRACY_REFERENDUM}>
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
          proposer={detail?.proposer}
          status={referendumStatus ?? {}}
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
    </PostProvider>
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
      redux: {
        detail,
        detailType: detailPageCategory.DEMOCRACY_REFERENDUM
      },
    },
  };
});
