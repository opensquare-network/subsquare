import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeReferendaListItem from "next-common/utils/viewfuncs/democracy/normalizeReferendaListItem";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import usePageTitle from "next-common/hooks/usePageTitle";
import ListLayout from "next-common/components/layout/ListLayout";
import DemocracySummary from "components/summary/democracySummary";

export default withLoginUserRedux(({ posts, chain, summary }) => {
  const items = (posts.items || []).map((item) =>
    normalizeReferendaListItem(chain, item),
  );
  const category = businessCategory.democracyReferenda;
  const title = usePageTitle(category);
  const seoInfo = {
    title,
    desc: title,
  };

  return (
    <ListLayout
      title="Democracy Referenda"
      description="Democracy uses public proposal, external proposal and referenda to mange the governance process."
      seoInfo={seoInfo}
      summary={<DemocracySummary summary={summary} />}
      tabs={[
        { label: "Referenda", url: "/democracy/referenda" },
        { label: "Statistics", url: "/democracy/statistics" },
      ]}
    >
      <PostList
        category={category}
        title="List"
        titleCount={posts.total}
        items={items}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
      />
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: posts }, { result: summary }] = await Promise.all([
    nextApi.fetch("democracy/referendums", {
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
      posts: posts ?? EmptyList,
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
      summary: summary ?? {},
    },
  };
});
