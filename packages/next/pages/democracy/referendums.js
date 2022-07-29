import List from "next-common/components/list";
import Menu from "next-common/components/menu";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Layout from "next-common/components/layout";
import { toReferendaListItem } from "utils/viewfuncs";
import DemocracySummary from "next-common/components/summary/democracySummary";
import businessCategory from "next-common/utils/consts/business/category";
import homeMenus from "next-common/utils/consts/menu";

export default withLoginUserRedux(({ loginUser, posts, chain }) => {
  const items = (posts.items || []).map((item) =>
    toReferendaListItem(chain, item)
  );
  const category = businessCategory.democracyReferenda;
  const seoInfo = { title: `Democracy Referenda`, desc: `Democracy Referenda` };

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
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
        summary={<DemocracySummary chain={chain} />}
      />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: posts }] = await Promise.all([
    nextApi.fetch(`democracy/referendums`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
    },
  };
});
