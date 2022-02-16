import List from "next-common/components/list";
import Menu from "next-common/components/menu";
import { mainMenu } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Layout from "components/layout";
import { toReferendaListItem } from "utils/viewfuncs";
import SEO from "next-common/components/SEO";
import DemocracySummary from "next-common/components/summary/democracySummary";

export default withLoginUserRedux(({ loginUser, posts, chain, siteUrl }) => {
  const items = (posts.items || []).map((item) =>
    toReferendaListItem(chain, item)
  );

  return (
    <Layout
      user={loginUser}
      left={<Menu menu={mainMenu} chain={chain} />}
      chain={chain}
    >
      <SEO
        title={`Democracy Referenda`}
        desc={`Democracy Referenda`}
        siteUrl={siteUrl}
        chain={chain}
      />
      <List
        chain={chain}
        category={"Referenda"}
        create={null}
        items={items}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
        summary={<DemocracySummary chain={chain} />}
      />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: posts }] = await Promise.all([
    nextApi.fetch(`democracy/referendums`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
      siteUrl: process.env.SITE_URL,
    },
  };
});
