import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import nextApi, { ssrNextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Timeline from "components/childBounty/timeline";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Metadata from "next-common/components/treasury/bounty/metadata";
import useUniversalComments from "components/universalComments";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { NoticeWrapper } from "next-common/components/styled/containers/titleContainer";
import TreasuryCountDown from "next-common/components/treasury/common/countdown";
import { getBannerUrl } from "next-common/utils/banner";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import Claim from "components/childBounty/claim";
import { useCallback, useEffect, useState } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { PostProvider } from "next-common/context/post";
import DetailLayout from "next-common/components/layout/DetailLayout";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";

const ChildBountyCountDown = ({ data = {} }) => {
  if (data.state?.state !== "PendingPayout") {
    return null;
  }

  const timeline = data.timeline ?? [];
  const awardedItem = [...timeline]
    .reverse()
    .find((item) => item.name === "Awarded");
  if (!awardedItem) {
    return null;
  }

  return (
    <NoticeWrapper>
      <TreasuryCountDown
        startHeight={awardedItem.indexer?.blockHeight}
        targetHeight={data.unlockAt}
        prefix="Claimable"
      />
    </NoticeWrapper>
  );
};

export default withLoginUserRedux(({ detail: ssrDetail, comments, chain }) => {
  const [detail, setDetail] = useState(ssrDetail);
  useEffect(() => setDetail(ssrDetail), [ssrDetail]);

  const isMounted = useIsMounted();

  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
    type: detailPageCategory.TREASURY_CHILD_BOUNTY,
  });

  const refreshPageData = useCallback(async () => {
    const { result } = await nextApi.fetch(
      `treasury/child-bounties/${detail.parentBountyId}_${detail.index}`
    );
    if (result && isMounted.current) {
      setDetail(result);
    }
  }, [detail, isMounted]);

  const onClaimFinalized = useWaitSyncBlock(
    "Child bounty claimed",
    refreshPageData
  );

  const desc = getMetaDesc(detail);

  const showRightSidePanel = ["PendingPayout", "Claimed"].includes(
    detail?.onchainData?.state?.state
  );

  const Layout = showRightSidePanel ? DetailWithRightLayout : DetailLayout;

  return (
    <PostProvider post={detail} type={detailPageCategory.TREASURY_CHILD_BOUNTY}>
      <Layout
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        <Back href={`/treasury/child-bounties`} text="Back to Child Bounties" />
        <DetailItem
          onReply={focusEditor}
          type={detailPageCategory.TREASURY_CHILD_BOUNTY}
          countDown={<ChildBountyCountDown data={detail.onchainData} />}
        />
        <Claim
          chain={chain}
          childBounty={detail?.onchainData}
          onFinalized={onClaimFinalized}
        />
        <Metadata meta={detail.onchainData?.meta} chain={chain} />
        <Timeline onchainData={detail.onchainData} chain={chain} />
        {CommentComponent}
      </Layout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const [{ result: detail }] = await Promise.all([
    ssrNextApi.fetch(`treasury/child-bounties/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  const { result: comments } = await ssrNextApi.fetch(
    `treasury/child-bounties/${detail._id}/comments`,
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
