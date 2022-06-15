import List from "next-common/components/list";
import Menu from "next-common/components/menu";
import { mainMenu } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Layout from "components/layout";
import { toTipListItem } from "utils/viewfuncs";
import Summary from "next-common/components/summary";

export default withLoginUserRedux(({ loginUser, tips, chain }) => {
  const items = (tips.items || []).map((item) => toTipListItem(chain, item));
  const category = "Tips";
  const seoInfo = { title: `Treasury Tips`, desc: `Treasury Tips` };

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
