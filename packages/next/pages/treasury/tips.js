import List from "components/list";
import Menu from "components/menu";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import { EmptyList } from "utils/constants";
import Layout from "components/layout";
import { toTipListItem } from "utils/viewfuncs";
import NextHead from "../../components/nextHead";

export default withLoginUserRedux(({ loginUser, tips, chain }) => {
  const items = (tips.items || []).map((item) => toTipListItem(chain, item));

  return (
    <Layout user={loginUser} left={<Menu menu={mainMenu} />} chain={chain}>
      <NextHead title={`Treasury Tips`} desc={`Treasury Tips`} />
      <List
        chain={chain}
        category={"Tips"}
        create={null}
        items={items}
        pagination={{
          page: tips.page,
          pageSize: tips.pageSize,
          total: tips.total,
        }}
      />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: tips }] = await Promise.all([
    nextApi.fetch(`treasury/tips`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      tips: tips ?? EmptyList,
    },
  };
});
