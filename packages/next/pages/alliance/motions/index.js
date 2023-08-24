import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import {
  ssrNextApi as nextApi,
  ssrNextApi,
} from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import normalizeAllianceMotion from "next-common/utils/viewfuncs/alliance/allianceMotion";
import PostList from "next-common/components/postList";
import businessCategory from "next-common/utils/consts/business/category";
import ListLayout from "next-common/components/layout/ListLayout";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";

export default withLoginUserRedux(({ motions }) => {
  const items = motions.items.map((item) => normalizeAllianceMotion(item));

  const seoInfo = {
    title: "Alliance motions",
    desc: "Alliance motions",
  };

  return (
    <ListLayout seoInfo={seoInfo} title={seoInfo.title}>
      <PostList
        category={businessCategory.allianceMotions}
        items={items}
        pagination={motions}
      />
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, page_size: pageSize } = context.query;
  const { result: motions } = await nextApi.fetch("alliance/motions", {
    page: page ?? 1,
    pageSize: pageSize ?? 50,
  });

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    ssrNextApi.fetch(gov2TracksApi),
    ssrNextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      motions: motions ?? EmptyList,
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
