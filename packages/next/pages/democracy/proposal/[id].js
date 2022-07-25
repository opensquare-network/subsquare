/* eslint-disable react/jsx-key */
import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Layout from "next-common/components/layout";
import { to404 } from "next-common/utils/serverSideUtil";
import { TYPE_DEMOCRACY_PROPOSAL } from "utils/viewConstants";
import { getMetaDesc } from "../../../utils/viewfuncs";
import Metadata from "next-common/components/publicProposal/metadata";
import Timeline from "components/publicProposal/timeline";
import Second from "next-common/components/publicProposal/second";
import OutWrapper from "next-common/components/styled/outWrapper";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import isNil from "lodash.isnil";
import MainCard from "next-common/components/styled/mainCard";
import useUniversalComments from "components/universalComments";

export default withLoginUserRedux(
  ({ loginUser, detail, comments, chain }) => {
    const { CommentComponent, focusEditor } = useUniversalComments({
      detail,
      comments,
      loginUser,
      chain,
      type: TYPE_DEMOCRACY_PROPOSAL,
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

    detail.status = detail?.onchainData?.state?.state;

    const desc = getMetaDesc(detail, "Proposal");
    return (
      <Layout
        user={loginUser}
        chain={chain}
        seoInfo={{ title: detail?.title, desc, ogImage: detail?.bannerUrl }}
      >
        <OutWrapper>
          <MainCard className="post-content">
            <Back href={`/democracy/proposals`} text="Back to Proposals" />
            <DetailItem
              data={detail}
              user={loginUser}
              chain={chain}
              onReply={focusEditor}
              type={TYPE_DEMOCRACY_PROPOSAL}
            />
            <Second
              chain={chain}
              proposalIndex={proposalIndex}
              hasTurnIntoReferendum={hasTurnIntoReferendum}
              hasCanceled={hasCanceled}
              useAddressVotingBalance={useAddressBalance}
              atBlockHeight={secondsAtBlockHeight}
            />
            <Metadata publicProposal={detail?.onchainData} chain={chain} />
            <Timeline timeline={detail?.onchainData?.timeline} chain={chain} />
            {CommentComponent}
          </MainCard>
        </OutWrapper>
      </Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

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
      chain,
    },
  };
});
