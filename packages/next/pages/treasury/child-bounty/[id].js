import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Layout from "next-common/components/layout";
import Timeline from "components/childBounty/timeline";
import { to404 } from "next-common/utils/serverSideUtil";
import { TYPE_TREASURY_CHILD_BOUNTY } from "utils/viewConstants";
import { getMetaDesc } from "utils/viewfuncs";
import DetailPageWrapper from "next-common/components/styled/detailPageWrapper";
import Metadata from "next-common/components/treasury/bounty/metadata";
import useUniversalComments from "components/universalComments";

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
    loginUser,
    chain,
    type: TYPE_TREASURY_CHILD_BOUNTY,
  });

  detail.status = detail.onchainData?.state?.state;

  const desc = getMetaDesc(detail, "Bounty");
  return (
    <Layout
      user={loginUser}
      chain={chain}
      seoInfo={{ title: detail?.title, desc, ogImage: detail?.bannerUrl }}
    >
      <DetailPageWrapper className="post-content">
        <Back href={`/treasury/child-bounties`} text="Back to Child Bounties" />
        <DetailItem
          data={detail}
          user={loginUser}
          chain={chain}
          onReply={focusEditor}
          type={TYPE_TREASURY_CHILD_BOUNTY}
        />
        <Metadata meta={detail.onchainData?.meta} chain={chain} />
        <Timeline childBounty={detail.onchainData} chain={chain} />
        {CommentComponent}
      </DetailPageWrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`treasury/child-bounties/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  const { result: comments } = await nextApi.fetch(
    `treasury/child-bounties/${detail._id}/comments`,
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
