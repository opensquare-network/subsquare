import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeReferendaListItem from "next-common/utils/viewfuncs/democracy/normalizeReferendaListItem";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import DemocracyReferendaLayout from "next-common/components/layout/democracyLayout/referenda";

export default withLoginUserRedux(({ posts, chain, summary }) => {
  const items = (posts.items || []).map((item) =>
    normalizeReferendaListItem(chain, item),
  );
  const category = businessCategory.democracyReferenda;
  const title = "Democracy " + category;
  const seoInfo = {
    title,
    desc: title,
  };

  return (
    <DemocracyReferendaLayout
      title={title}
      seoInfo={seoInfo}
      summaryData={summary}
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
    </DemocracyReferendaLayout>
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
