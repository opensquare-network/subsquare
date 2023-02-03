import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { toAdvisoryMotionsListItem } from "utils/viewfuncs";
import businessCategory from "next-common/utils/consts/business/category";
import HomeLayout from "next-common/components/layout/HomeLayout";

export default withLoginUserRedux(({ motions, chain }) => {
  const items = (motions.items || []).map((item) =>
    toAdvisoryMotionsListItem(chain, item)
  );
  const category = businessCategory.advisoryMotions;
  const seoInfo = {
    title: `Advisory Committee Motions`,
    desc: `Advisory Committee Motions`,
  };

  return (
    <HomeLayout seoInfo={seoInfo}>
      <PostList
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

  const { result: motions } = await nextApi.fetch(`advisory-motions`, {
    page: page ?? 1,
    pageSize: pageSize ?? 50,
  });

  return {
    props: {
      chain,
      motions: motions ?? EmptyList,
    },
  };
});
