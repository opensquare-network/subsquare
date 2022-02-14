import List from "next-common/components/list";
import Menu from "next-common/components/menu";
import { mainMenu } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Layout from "components/layout";
import { toExternalProposalListItem } from "utils/viewfuncs";
import SEO from "components/SEO";
import DemocracySummary from "next-common/components/summary/democracySummary";

export default withLoginUserRedux(
  ({ loginUser, externals, chain, siteUrl }) => {
    const items = (externals.items || []).map((item) =>
      toExternalProposalListItem(chain, item)
    );

    return (
      <Layout
        user={loginUser}
        left={<Menu menu={mainMenu} chain={chain} />}
        chain={chain}
      >
        <SEO
          title={`Democracy External Proposals`}
          desc={`Democracy External Proposals`}
          siteUrl={siteUrl}
          chain={chain}
        />
        <List
          chain={chain}
          category={"Democracy External Proposals"}
          create={null}
          items={items}
          pagination={{
            page: externals.page,
            pageSize: externals.pageSize,
            total: externals.total,
          }}
          summary={<DemocracySummary chain={chain} />}
        />
      </Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: externals }] = await Promise.all([
    nextApi.fetch(`democracy/externals`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      externals: externals ?? EmptyList,
      siteUrl: process.env.SITE_URL,
    },
  };
});
