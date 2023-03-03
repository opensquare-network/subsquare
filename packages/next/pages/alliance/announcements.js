import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import HomeLayout from "next-common/components/layout/HomeLayout";
import PostList from "next-common/components/postList";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeAllianceAnnouncement from "next-common/utils/viewfuncs/alliance/allianceAnnouncement";

export default withLoginUserRedux(({ announcements }) => {
  const items = announcements.items.map((item) =>
    normalizeAllianceAnnouncement(item)
  );

  return (
    <HomeLayout
      seoInfo={{
        title: "Alliance announcements",
        desc: "Alliance announcements",
      }}
    >
      <PostList
        category={businessCategory.allianceAnnouncements}
        items={items}
        pagination={announcements}
      />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, page_size: pageSize } = context.query;
  const { result: announcements } = await nextApi.fetch(
    "alliance/announcements",
    {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }
  );

  return {
    props: {
      announcements,
    },
  };
});
