import List from "components/list";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import { EmptyList } from "utils/constants";
import Layout from "components/layout";
import { toFinancialMotionsListItem } from "utils/viewfuncs";
import SEO from "components/SEO";

export default withLoginUserRedux(({ loginUser, motions, chain, siteUrl }) => {
  const items = (motions.items || []).map((item) =>
    toFinancialMotionsListItem(chain, item)
  );

  return (
    <Layout
      user={loginUser}
      left={<Menu menu={mainMenu} chain={chain} />}
      chain={chain}
    >
      <SEO
        title={`Financial motions`}
        desc={`Financial motions`}
        siteUrl={siteUrl}
        chain={chain}
      />
      <List
        chain={chain}
        category={"Financial Motions"}
        create={null}
        items={items}
        pagination={{
          page: motions.page,
          pageSize: motions.pageSize,
          total: motions.total,
        }}
      />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { page, page_size: pageSize } = context.query;

  const [{ result: motions }] = await Promise.all([
    nextApi.fetch(`financial-motions`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      motions: motions ?? EmptyList,
      siteUrl: process.env.SITE_URL,
    },
  };
});
