import PostList from "next-common/components/postList";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { toFinancialMotionsListItem } from "utils/viewfuncs";
import businessCategory from "next-common/utils/consts/business/category";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchList } from "next-common/services/list";

export default withLoginUserRedux(({ motions }) => {
  const items = (motions.items || []).map((item) =>
    toFinancialMotionsListItem(item),
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
  const motions = await fetchList("financial-motions", context);

  return {
    props: {
      motions,
    },
  };
});
