import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeTreasuryCouncilMotionListItem from "next-common/utils/viewfuncs/collective/normalizeTreasuryCouncilMotionListItem";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import ListLayout from "next-common/components/layout/ListLayout";

export default withLoginUserRedux(({ motions, chain }) => {
  const items = (motions.items || []).map((item) =>
    normalizeTreasuryCouncilMotionListItem(chain, item),
  );
  const category = businessCategory.treasuryCouncilMotions;
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Treasury council motions"
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
  const chain = process.env.CHAIN;
  const { page, page_size: pageSize } = context.query;

  const [{ result: motions }] = await Promise.all([
    nextApi.fetch("motions", {
      page: page ?? 1,
      pageSize: pageSize ?? defaultPageSize,
    }),
  ]);

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      chain,
      motions: motions ?? EmptyList,
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
