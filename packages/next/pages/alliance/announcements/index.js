import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import PostList from "next-common/components/postList";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeAllianceAnnouncement from "next-common/utils/viewfuncs/alliance/allianceAnnouncement";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";

export default withLoginUserRedux(({ announcements }) => {
  const items = announcements.items.map((item) =>
    normalizeAllianceAnnouncement(item),
  );

  const seoInfo = {
    title: "Alliance announcements",
    desc: "Alliance announcements",
  };

  return (
    <ListLayout seoInfo={seoInfo} title={seoInfo.title}>
      <PostList
        category={businessCategory.allianceAnnouncements}
        title="List"
        titleCount={announcements.total}
        items={items}
        pagination={announcements}
      />
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const announcements = await fetchList("alliance/announcements", context);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      announcements,
      ...tracksProps,
    },
  };
});
