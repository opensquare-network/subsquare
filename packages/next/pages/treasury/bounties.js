import List from "next-common/components/list";
import Menu from "next-common/components/menu";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Layout from "next-common/components/layout";
import { toTreasuryBountyListItem } from "utils/viewfuncs";
import Summary from "next-common/components/summary";
import homeMenus from "next-common/utils/consts/menu";

export default withLoginUserRedux(({ loginUser, bounties, chain }) => {
  const items = (bounties.items || []).map((item) =>
    toTreasuryBountyListItem(chain, item)
  );
  const category = "Treasury Bounties";
  const seoInfo = { title: category, desc: category };

  return (
    <Layout
      user={loginUser}
      left={<Menu menu={homeMenus} chain={chain} />}
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
          page: bounties.page,
          pageSize: bounties.pageSize,
          total: bounties.total,
        }}
      />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: bounties }] = await Promise.all([
    nextApi.fetch(`treasury/bounties`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      bounties: bounties ?? EmptyList,
    },
  };
});
