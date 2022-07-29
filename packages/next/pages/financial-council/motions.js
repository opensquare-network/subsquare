import List from "next-common/components/list";
import Menu from "next-common/components/menu";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Layout from "next-common/components/layout";
import { toFinancialMotionsListItem } from "utils/viewfuncs";
import homeMenus from "next-common/utils/consts/menu";

export default withLoginUserRedux(({ loginUser, motions, chain }) => {
  const items = (motions.items || []).map((item) =>
    toFinancialMotionsListItem(chain, item)
  );
  const category = "Financial Motions";
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
    },
  };
});
