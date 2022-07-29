import List from "next-common/components/list";
import Menu from "next-common/components/menu";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Layout from "next-common/components/layout";
import { toTreasuryChildBountyListItem } from "utils/viewfuncs";
import Summary from "next-common/components/summary";
import homeMenus from "next-common/utils/consts/menu";

export default withLoginUserRedux(({ loginUser, bounties, chain }) => {
  const items = (bounties.items || []).map((item) =>
    toTreasuryChildBountyListItem(chain, item)
  );
  const category = "Treasury Child Bounties";
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

  const { page, page_size: pageSize, parentBountyId } = context.query;

  const [{ result: bounties }] = await Promise.all([
    nextApi.fetch(`treasury/child-bounties`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
      parent: parentBountyId ?? "",
    }),
  ]);

  return {
    props: {
      chain,
      bounties: bounties ?? EmptyList,
    },
  };
});
