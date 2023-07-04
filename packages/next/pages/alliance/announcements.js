import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import {
  ssrNextApi as nextApi,
  ssrNextApi,
} from "next-common/services/nextApi";
import PostList from "next-common/components/postList";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeAllianceAnnouncement from "next-common/utils/viewfuncs/alliance/allianceAnnouncement";
import ListLayout from "next-common/components/layout/ListLayout";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";

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
  const { page, page_size: pageSize } = context.query;
  const { result: announcements } = await nextApi.fetch(
    "alliance/announcements",
    {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    },
  );

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    ssrNextApi.fetch(gov2TracksApi),
    ssrNextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      announcements,
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
