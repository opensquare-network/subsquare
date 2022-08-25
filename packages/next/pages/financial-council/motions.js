import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { toFinancialMotionsListItem } from "utils/viewfuncs";
import HomeLayout from "next-common/components/layout/HomeLayout";

export default withLoginUserRedux(({ loginUser, motions, chain }) => {
  const items = (motions.items || []).map((item) =>
    toFinancialMotionsListItem(chain, item)
  );
  const category = "Financial Motions";
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout user={loginUser} seoInfo={seoInfo}>
      <PostList
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
    </HomeLayout>
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
