import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Layout from "next-common/components/layout";
import { getNode } from "next-common/utils";
import Timeline from "components/bounty/timeline";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import DetailPageWrapper from "next-common/components/styled/detailPageWrapper";
import Metadata from "next-common/components/treasury/bounty/metadata";
import ChildBountiesTable from "../../../components/bounty/childBountiesTable";
import useUniversalComments from "components/universalComments";
import { detailPageCategory } from "next-common/utils/consts/business/category";

export default withLoginUserRedux(
  ({ loginUser, detail, childBounties, comments, chain }) => {
    const { CommentComponent, focusEditor } = useUniversalComments({
      detail,
      comments,
      loginUser,
      chain,
      type: detailPageCategory.TREASURY_BOUNTY,
    });

    const node = getNode(chain);
    if (!node) {
      return null;
    }
    const decimals = node.decimals;
    const symbol = node.symbol;

    detail.status = detail.onchainData?.state?.state;

    const desc = getMetaDesc(detail);
    return (
      <Layout
        user={loginUser}
        chain={chain}
        seoInfo={{ title: detail?.title, desc, ogImage: detail?.bannerUrl }}
      >
        <DetailPageWrapper className="post-content">
          <Back href={`/treasury/bounties`} text="Back to Bounties" />
          <DetailItem
            data={detail}
            user={loginUser}
            chain={chain}
            onReply={focusEditor}
            type={detailPageCategory.TREASURY_BOUNTY}
          />
          <Metadata meta={detail.onchainData?.meta} chain={chain} />
          <ChildBountiesTable {...{ childBounties, decimals, symbol }} />
          <Timeline bounty={detail?.onchainData} chain={chain} />
          {CommentComponent}
        </DetailPageWrapper>
      </Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const [{ result: detail }, { result: childBounties }] = await Promise.all([
    nextApi.fetch(`treasury/bounties/${id}`),
    nextApi.fetch(`treasury/bounties/${id}/child-bounties`, { pageSize: 5 }),
  ]);

  if (!detail) {
    return to404(context);
  }

  const { result: comments } = await nextApi.fetch(
    `treasury/bounties/${detail._id}/comments`,
    {
      page: page ?? "last",
      pageSize,
    }
  );

  return {
    props: {
      detail,
      childBounties: childBounties ?? EmptyList,
      comments: comments ?? EmptyList,
      chain,
    },
  };
});
