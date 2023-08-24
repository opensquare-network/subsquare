import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { toFinancialMotionsListItem } from "utils/viewfuncs";
import { useChain } from "next-common/context/chain";
import businessCategory from "next-common/utils/consts/business/category";
import ListLayout from "next-common/components/layout/ListLayout";

export default withLoginUserRedux(({ motions }) => {
  const chain = useChain();
  const items = (motions.items || []).map((item) =>
    toFinancialMotionsListItem(chain, item),
  );
  const category = businessCategory.financialMotions;
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Financial council motions"
    >
      <PostList
        category={category}
        title="List"
        titleCount={motions.total}
        items={items}
        pagination={{
          page: motions.page,
          pageSize: motions.pageSize,
          total: motions.total,
        }}
      />
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, page_size: pageSize } = context.query;

  const [{ result: motions }] = await Promise.all([
    nextApi.fetch("financial-motions", {
      page: page ?? 1,
      pageSize: pageSize ?? defaultPageSize,
    }),
  ]);

  return {
    props: {
      motions: motions ?? EmptyList,
    },
  };
});
