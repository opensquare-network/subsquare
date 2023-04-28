import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import DemocracySummary from "next-common/components/summary/democracySummary";
import businessCategory from "next-common/utils/consts/business/category";
import HomeLayout from "next-common/components/layout/HomeLayout";
import DemocracySummaryFooter from "next-common/components/summary/democracySummaryFooter";
import normalizeExternalListItem from "next-common/utils/viewfuncs/democracy/normliazeExternalListItem";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";

export default withLoginUserRedux(
  ({ externals, chain, tracks, fellowshipTracks }) => {
    const items = (externals.items || []).map((item) =>
      normalizeExternalListItem(chain, item)
    );
    const category = businessCategory.democracyExternals;
    const seoInfo = { title: category, desc: category };

    return (
      <HomeLayout
        seoInfo={seoInfo}
        tracks={tracks}
        fellowshipTracks={fellowshipTracks}
      >
        <PostList
          category={category}
          items={items}
          pagination={{
            page: externals.page,
            pageSize: externals.pageSize,
            total: externals.total,
          }}
          summary={<DemocracySummary footer={<DemocracySummaryFooter />} />}
        />
      </HomeLayout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: externals }] = await Promise.all([
    nextApi.fetch("democracy/externals", {
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
      externals: externals ?? EmptyList,
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
