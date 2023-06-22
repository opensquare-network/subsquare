import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import businessCategory from "next-common/utils/consts/business/category";
import HomeLayout from "next-common/components/layout/HomeLayout";
import normalizeProposalListItem from "next-common/utils/viewfuncs/democracy/normalizeProposalListItem";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import MaybeNoDemocracySummary from "next-common/components/maybeNoDemocracySummary";
import usePageTitle from "next-common/hooks/usePageTitle";

export default withLoginUserRedux(
  ({ proposals, chain, tracks, fellowshipTracks, summary }) => {
    const items = (proposals.items || []).map((item) =>
      normalizeProposalListItem(chain, item)
    );
    const category = businessCategory.democracyProposals;
    const title = usePageTitle(category);
    const seoInfo = { title, desc: title };

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
            page: proposals.page,
            pageSize: proposals.pageSize,
            total: proposals.total,
          }}
          summary={<MaybeNoDemocracySummary summary={summary} />}
        />
      </HomeLayout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: proposals }, { result: summary }] = await Promise.all([
    nextApi.fetch("democracy/proposals", {
      page: page ?? 1,
      pageSize: pageSize ?? defaultPageSize,
    }),
    nextApi.fetch("summary"),
  ]);

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      chain,
      proposals: proposals ?? EmptyList,
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
      summary: summary ?? {},
    },
  };
});
