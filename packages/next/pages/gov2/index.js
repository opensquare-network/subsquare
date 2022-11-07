import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { EmptyList } from "next-common/utils/constants";
import Gov2Layout from "next-common/components/layout/Gov2Layout";
import PostList from "next-common/components/postList";
// TODO: use this directly?
import DemocracySummary from "next-common/components/summary/democracySummary";
import { toGov2ReferendaListItem } from "utils/viewfuncs";
import mockGov2Posts from "next-common/utils/mocks/gov2-posts.json";
import nextApi from "next-common/services/nextApi";
import { gov2TracksApi } from "next-common/services/url";

export default withLoginUserRedux(
  ({ loginUser, chain, posts, title, tracks }) => {
    // FIXME: seo
    const seoInfo = { title: "", desc: "" };
    const items = (posts.items || []).map((item) =>
      toGov2ReferendaListItem(chain, item)
    );

    return (
      <Gov2Layout user={loginUser} seoInfo={seoInfo} tracks={tracks}>
        <PostList
          chain={chain}
          title={title}
          category="gov2"
          create={null}
          items={items}
          pagination={{
            page: posts.page,
            pageSize: posts.pageSize,
            total: posts.total,
          }}
          summary={<DemocracySummary chain={chain} />}
        />
      </Gov2Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;
  // TODO: fetch posts

  const [{ result: tracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
  ]);

  const posts = {
    items: mockGov2Posts,
    page: 1,
    pageSize: 50,
  };

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
      title: "All Referenda",
      tracks,
    },
  };
});
