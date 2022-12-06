/* eslint-disable react/jsx-key */
import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Metadata from "next-common/components/publicProposal/metadata";
import Timeline from "components/publicProposal/timeline";
import Second from "next-common/components/publicProposal/second";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import isNil from "lodash.isnil";
import useUniversalComments from "components/universalComments";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import { useCallback, useEffect, useState } from "react";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";

export default withLoginUserRedux(({ detail: ssrDetail, comments }) => {
  const [detail, setDetail] = useState(ssrDetail);
  useEffect(() => setDetail(ssrDetail), [ssrDetail]);
  const isMounted = useIsMounted();

  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
    type: detailPageCategory.DEMOCRACY_PROPOSAL,
  });

  const publicProposal = detail?.onchainData;
  const proposalIndex = publicProposal?.proposalIndex;
  const state = publicProposal?.state?.state;
  const isEnded = ["Tabled", "Canceled", "Cleared"].includes(state);
  const hasTurnIntoReferendum = !isNil(publicProposal.referendumIndex);
  const hasCanceled = ["Canceled", "Cleared"].includes(state);

  const timeline = publicProposal?.timeline;
  const lastTimelineBlockHeight =
    timeline?.[timeline?.length - 1]?.indexer.blockHeight;
  const secondsAtBlockHeight = isEnded
    ? lastTimelineBlockHeight - 1
    : undefined;

  const refreshPageData = useCallback(async () => {
    const { result } = await nextApi.fetch(
      `democracy/proposals/${detail.proposalIndex}`
    );
    if (result && isMounted.current) {
      setDetail(result);
    }
  }, [detail, isMounted]);

  const onSecondFinalized = useWaitSyncBlock(
    "Proposal seconded",
    refreshPageData
  );

  const desc = getMetaDesc(detail);

  const breadcrumbItems = [
    {
      content: "Democracy",
    },
    {
      content: "Proposals",
      path: "/democracy/proposals",
    },
    {
      content: `#${detail?.proposalIndex}`,
    },
  ];

  return (
    <PostProvider post={detail} type={detailPageCategory.DEMOCRACY_PROPOSAL}>
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

        <DetailItem
          onReply={focusEditor}
          type={detailPageCategory.DEMOCRACY_PROPOSAL}
        />
        <Second
          proposalIndex={proposalIndex}
          hasTurnIntoReferendum={hasTurnIntoReferendum}
          hasCanceled={hasCanceled}
          useAddressVotingBalance={useAddressBalance}
          atBlockHeight={secondsAtBlockHeight}
          onFinalized={onSecondFinalized}
        />
        <Metadata publicProposal={detail?.onchainData} />
        <Timeline timeline={detail?.onchainData?.timeline} />
        {CommentComponent}
      </DetailWithRightLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`democracy/proposals/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  const { result: comments } = await nextApi.fetch(
    `democracy/proposals/${detail._id}/comments`,
    {
      page: page ?? "last",
      pageSize,
    }
  );

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
    },
  };
});
