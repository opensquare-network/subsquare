import { withCommonProps } from "next-common/lib";
import normalizeAllianceMotion from "next-common/utils/viewfuncs/alliance/allianceMotion";
import PostList from "next-common/components/postList";
import businessCategory from "next-common/utils/consts/business/category";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";

export default function MotionsPage({ motions }) {
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
}

export const getServerSideProps = withCommonProps(async (context) => {
  const motions = await fetchList("alliance/motions", context);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      motions,
      ...tracksProps,
    },
  };
});
