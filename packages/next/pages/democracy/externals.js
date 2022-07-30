import List from "next-common/components/list";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { toExternalProposalListItem } from "utils/viewfuncs";
import DemocracySummary from "next-common/components/summary/democracySummary";
import businessCategory from "next-common/utils/consts/business/category";
import HomeLayout from "next-common/components/layout/HomeLayout";

export default withLoginUserRedux(({ loginUser, externals, chain }) => {
  const items = (externals.items || []).map((item) =>
    toExternalProposalListItem(chain, item)
  );
  const category = businessCategory.democracyExternals;
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout user={loginUser} seoInfo={seoInfo}>
      <List
        chain={chain}
        category={category}
        create={null}
        items={items}
        pagination={{
          page: externals.page,
          pageSize: externals.pageSize,
          total: externals.total,
        }}
        summary={<DemocracySummary chain={chain} />}
      />
    </HomeLayout>
  );
});

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
    },
  };
});
