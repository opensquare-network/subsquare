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
import { sleep } from "next-common/utils";
import {
  newPendingToast,
  newToastId,
  removeToast,
} from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";

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

export default withLoginUserRedux(
  ({ loginUser, detail: ssrDetail, comments, chain }) => {
    const [detail, setDetail] = useState(ssrDetail);
    const isMounted = useIsMounted();
    const dispatch = useDispatch();
    const toastId = newToastId();

    useEffect(() => setDetail(ssrDetail), [ssrDetail]);

    const { CommentComponent, focusEditor } = useUniversalComments({
      detail,
      comments,
      loginUser,
      chain,
      type: detailPageCategory.TREASURY_CHILD_BOUNTY,
    });

    const updateDetailForState = useCallback(
      async (endState) => {
        let times = 6;

        try {
          while (times-- > 0) {
            if (!isMounted.current) {
              return;
            }

            await sleep(10000);

            const { result } = await nextApi.fetch(
              `treasury/child-bounties/${detail.parentBountyId}_${detail.index}`
            );

            if (result?.state?.state === endState) {
              if (isMounted.current) {
                setDetail(result);
              }
              return;
            }
          }
        } finally {
          dispatch(removeToast(toastId));
        }
      },
      [dispatch, toastId, detail, isMounted]
    );

    const onClaimInBlock = useCallback(() => {
      dispatch(newPendingToast(toastId, "Waiting to sync on-chain data..."));
    }, [dispatch, toastId]);

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
        <Back href={`/treasury/child-bounties`} text="Back to Child Bounties" />
        <DetailItem
          data={detail}
          user={loginUser}
          chain={chain}
          onReply={focusEditor}
          type={detailPageCategory.TREASURY_CHILD_BOUNTY}
          countDown={<ChildBountyCountDown data={detail.onchainData} />}
        />
        <Claim
          chain={chain}
          childBounty={detail?.onchainData}
          onInBlock={onClaimInBlock}
          onFinalized={() => updateDetailForState("Claimed")}
        />
        <Metadata meta={detail.onchainData?.meta} chain={chain} />
        <Timeline onchainData={detail.onchainData} chain={chain} />
        {CommentComponent}
      </DetailWithRightLayout>
    );
  }
);

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
      redux: {
        detail,
        detailType: detailPageCategory.TREASURY_CHILD_BOUNTY,
      },
    },
  };
});
