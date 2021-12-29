import List from "components/list";
import Menu from "components/menu";
import { getMainMenu } from "utils";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import { EmptyList } from "utils/constants";
import Layout from "components/layout";
import { toTreasuryProposalListItem } from "utils/viewfuncs";
import SEO from "components/SEO";
import Summary from "components/summary";

export default withLoginUserRedux(
  ({ loginUser, proposals, chain, siteUrl }) => {
    const items = (proposals.items || []).map((item) =>
      toTreasuryProposalListItem(chain, item)
    );

    return (
      <Layout user={loginUser} left={<Menu menu={mainMenu} />} chain={chain}>
        <SEO
          title={`Treasury Proposals`}
          desc={`Treasury Proposals`}
          siteUrl={siteUrl}
          chain={chain}
        />
        <List
          chain={chain}
          category={"Treasury Proposals"}
          create={null}
          items={items}
          summary={<Summary chain={chain} />}
          pagination={{
            page: proposals.page,
            pageSize: proposals.pageSize,
            total: proposals.total,
          }}
        />
      </Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: proposals }] = await Promise.all([
    nextApi.fetch(`treasury/proposals`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      proposals: proposals ?? EmptyList,
      siteUrl: process.env.SITE_URL,
    },
  };
});
