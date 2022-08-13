import Back from "next-common/components/back";
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
import { detailPageCategory } from "next-common/utils/consts/business/category";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";

export default withLoginUserRedux(
  ({ loginUser, detail, referendum, comments, chain }) => {
    const { CommentComponent, focusEditor } = useCommentComponent({
      detail,
      comments,
      loginUser,
      chain,
      type: detailPageCategory.DEMOCRACY_PROPOSAL,
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

    detail.status = detail.onchainData?.state?.state;

    const desc = getMetaDesc(detail);
    return (
      <DetailWithRightLayout
        user={loginUser}
        seoInfo={{ title: detail?.title, desc, ogImage: detail?.bannerUrl }}
      >
        <Back href={`/democracy/proposals`} text="Back to Proposals" />
        <DetailItem
          data={detail}
          user={loginUser}
          chain={chain}
          onReply={focusEditor}
          type={detailPageCategory.DEMOCRACY_PROPOSAL}
        />
        <Second
          chain={chain}
          proposalIndex={proposalIndex}
          hasTurnIntoReferendum={hasTurnIntoReferendum}
          hasCanceled={hasCanceled}
          useAddressVotingBalance={useAddressVotingBalance}
          atBlockHeight={secondsAtBlockHeight}
        />
        <Business referendumIndex={referendumIndex} />
        <Metadata publicProposal={detail?.onchainData} chain={chain} />
        <Timeline
          publicProposalTimeline={detail?.onchainData?.timeline}
          referendumTimeline={referendum?.onchainData?.timeline}
          chain={chain}
        />
        {CommentComponent}
      </DetailWithRightLayout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
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
      chain,
    },
  };
});
