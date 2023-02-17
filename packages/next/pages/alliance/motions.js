import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import normalizeAllianceMotion from "../../utils/viewfuncs/allianceMotion";
import HomeLayout from "next-common/components/layout/HomeLayout";
import PostList from "next-common/components/postList";
import businessCategory from "next-common/utils/consts/business/category";

export default withLoginUserRedux(({ motions }) => {
  const items = motions.items.map((item) => normalizeAllianceMotion(item));

  return <HomeLayout seoInfo={{
    title: `Alliance motions`,
    desc: `Alliance motions`,
  }}>
    <PostList
      category={businessCategory.allianceMotions}
      items={items}
      pagination={motions}
    />
  </HomeLayout>
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, page_size: pageSize } = context.query;
  const { result: motions } = await nextApi.fetch(`alliance/motions`, {
    page: page ?? 1,
    pageSize: pageSize ?? 50,
  });

  return {
    props: {
      motions: motions ?? EmptyList,
    },
  };
});
