import Back from "next-common/components/back";
import DetailItem from "components/polkassembly/detailItem";
import PolkassemblyComments from "components/polkassembly/comment";
import usePostComments from "components/polkassembly/usePostComments";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Layout from "next-common/components/layout";
import { to404 } from "next-common/utils/serverSideUtil";
import DetailPageWrapper from "next-common/components/styled/detailPageWrapper";
import { TYPE_PA_POST } from "utils/viewConstants";
import { getMetaDesc } from "utils/viewfuncs";

export default withLoginUserRedux(
  ({ loginUser, detail, chain, page, pageSize }) => {
    const polkassemblyId = detail?.polkassemblyId;
    const { comments, postReactions, loadingComments } = usePostComments({
      polkassemblyId,
      chain,
      page,
      pageSize,
    });

    const desc = getMetaDesc(detail, "Polkassembly Discussions");
    return (
      <Layout
        user={loginUser}
        chain={chain}
        seoInfo={{ title: detail?.title, desc, ogImage: detail?.bannerUrl }}
      >
        <DetailPageWrapper className="post-content">
          <Back
            href={`/polkassembly-discussions`}
            text="Back to Polkassembly Discussions"
          />
          <DetailItem
            data={detail}
            chain={chain}
            postReactions={postReactions}
            type={TYPE_PA_POST}
          />
          <PolkassemblyComments
            isLoading={loadingComments}
            data={{
              items: comments,
              page: page + 1,
              pageSize,
              total: detail?.commentsCount,
            }}
            chain={chain}
            type={TYPE_PA_POST}
            paId={polkassemblyId}
          />
        </DetailPageWrapper>
      </Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { id, page } = context.query;
  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`polkassembly-discussions/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  return {
    props: {
      detail,
      chain,
      page: (page ?? 1) - 1,
      pageSize: 10,
    },
  };
});
