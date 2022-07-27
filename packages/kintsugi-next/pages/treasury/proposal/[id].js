import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Layout from "next-common/components/layout";
import Timeline from "components/treasuryProposal/timeline";
import Metadata from "next-common/components/treasury/proposal/metadata";
import { to404 } from "next-common/utils/serverSideUtil";
import { TYPE_TREASURY_PROPOSAL } from "utils/viewConstants";
import { getMetaDesc } from "../../../utils/viewfuncs";
import DetailPageWrapper from "next-common/components/styled/detailPageWrapper";
import useCommentComponent from "next-common/components/useCommentComponent";

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  const { CommentComponent, focusEditor } = useCommentComponent({
    detail,
    comments,
    loginUser,
    chain,
    type: TYPE_TREASURY_PROPOSAL,
  });

  detail.status = detail.onchainData?.state?.state;

  const desc = getMetaDesc(detail, "Proposal");
  return (
    <Layout
      user={loginUser}
      chain={chain}
      seoInfo={{ title: detail?.title, desc, ogImage: detail?.bannerUrl }}
    >
      <DetailPageWrapper className="post-content">
        <Back href={`/treasury/proposals`} text="Back to Proposals" />
        <DetailItem
          data={detail}
          user={loginUser}
          chain={chain}
          onReply={focusEditor}
          type={TYPE_TREASURY_PROPOSAL}
        />
        <Metadata treasuryProposal={detail?.onchainData} chain={chain} />
        <Timeline treasuryProposal={detail?.onchainData} chain={chain} />
        {CommentComponent}
      </DetailPageWrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`treasury/proposals/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  const { result: comments } = await nextApi.fetch(
    `treasury/proposals/${detail._id}/comments`,
    {
      page: page ?? "last",
      pageSize: Math.min(pageSize ?? 50, 100),
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
