import List from "components/list";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import { EmptyList } from "utils/constants";
import Layout from "components/layout";
import { toTreasuryBountyListItem } from "utils/viewfuncs";
import NextHead from "../../components/nextHead";

export default withLoginUserRedux(({ loginUser, bounties, chain }) => {
  const items = (bounties.items || []).map((item) =>
    toTreasuryBountyListItem(chain, item)
  );

  return (
    <Layout user={loginUser} left={<Menu menu={mainMenu} />} chain={chain}>
      <NextHead title={`Treasury Bounties`} desc={`Treasury Bounties`} />
      <List
        chain={chain}
        category={"Treasury Bounties"}
        create={null}
        items={items}
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
