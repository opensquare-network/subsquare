import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Timeline from "components/publicProposal/timeline";
import Business from "components/publicProposal/business";
import Metadata from "next-common/components/publicProposal/metadata";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Second from "next-common/components/publicProposal/second";
import { useAddressVotingBalance } from "utils/hooks";
import isNil from "lodash.isnil";
import useCommentComponent from "next-common/components/useCommentComponent";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import { useCallback, useEffect, useState } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";

export default withLoginUserRedux(
  ({ detail: ssrDetail, referendum, comments }) => {
    const [detail, setDetail] = useState(ssrDetail);
    useEffect(() => setDetail(ssrDetail), [ssrDetail]);
    const isMounted = useIsMounted();

    const { CommentComponent, focusEditor } = useCommentComponent({
      detail,
      comments,
    });

    const publicProposal = detail?.onchainData;
    const proposalIndex = publicProposal?.proposalIndex;
    const state = publicProposal?.state?.state;
    const isEnded = ["Tabled", "Canceled", "FastTracked", "Cleared"].includes(
      state
    );
    const hasTurnIntoReferendum = !isNil(publicProposal.referendumIndex);
    const hasCanceled = ["Canceled", "Cleared"].includes(state);

    const timeline = publicProposal?.timeline;
    const lastTimelineBlockHeight =
      timeline?.[timeline?.length - 1]?.indexer.blockHeight;
    const secondsAtBlockHeight = isEnded
      ? lastTimelineBlockHeight - 1
      : undefined;

    const referendumIndex = detail?.referendumIndex;

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

          <DetailItem onReply={focusEditor} />
          <Second
            proposalIndex={proposalIndex}
            hasTurnIntoReferendum={hasTurnIntoReferendum}
            hasCanceled={hasCanceled}
            useAddressVotingBalance={useAddressVotingBalance}
            atBlockHeight={secondsAtBlockHeight}
            onFinalized={onSecondFinalized}
          />
          <Business referendumIndex={referendumIndex} />
          <Metadata publicProposal={detail?.onchainData} />
          <Timeline
            publicProposalTimeline={detail?.onchainData?.timeline}
            referendumTimeline={referendum?.onchainData?.timeline}
          />
          {CommentComponent}
        </DetailWithRightLayout>
      </PostProvider>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`democracy/proposals/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  let referendum = null;
  if ((detail.referendumIndex ?? null) !== null) {
    const result = await nextApi.fetch(
      `democracy/referendums/${detail.referendumIndex}`
    );
    referendum = result.result;
  }

  const { result: comments } = await nextApi.fetch(
    `democracy/proposals/${detail._id}/comments`,
    {
      page: page ?? "last",
      pageSize: Math.min(pageSize ?? 50, 100),
    }
  );

  return {
    props: {
      detail,
      referendum,
      comments: comments ?? EmptyList,
    },
  };
});
