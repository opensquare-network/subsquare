import List from "next-common/components/list";
import Menu from "next-common/components/menu";
import { mainMenu } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Layout from "components/layout";
import { toTreasuryProposalListItem } from "utils/viewfuncs";
import Summary from "next-common/components/summary";

export default withLoginUserRedux(
  ({ loginUser, proposals, chain, siteUrl }) => {
    const items = (proposals.items || []).map((item) =>
      toTreasuryProposalListItem(chain, item)
    );
    const category = "Treasury Proposals";
    const seoInfo = { title: category, desc: category };

    return (
      <Layout
        user={loginUser}
        left={<Menu menu={mainMenu} chain={chain} />}
        chain={chain}
        seoInfo={seoInfo}
      >
        <List
          chain={chain}
          category={category}
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
