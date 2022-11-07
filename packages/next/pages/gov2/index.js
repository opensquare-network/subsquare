import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { EmptyList } from "next-common/utils/constants";
import Gov2Layout from "next-common/components/layout/Gov2Layout";
import PostList from "next-common/components/postList";
// TODO: use this directly?
import DemocracySummary from "next-common/components/summary/democracySummary";
import { toGov2ReferendaListItem } from "utils/viewfuncs";
import nextApi from "next-common/services/nextApi";
import { gov2ReferendumsApi, gov2TracksApi } from "next-common/services/url";

export default withLoginUserRedux(
  ({ loginUser, chain, posts, title, tracks }) => {
    // FIXME: seo
    const seoInfo = { title: "", desc: "" };
    const items = (posts.items || []).map((item) =>
      toGov2ReferendaListItem(chain, item, tracks)
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

  const { page = 1, page_size: pageSize = 50 } = context.query;

  const [{ result: tracks }, { result: posts }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(gov2ReferendumsApi, {
      page,
      pageSize,
    }),
  ]);

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
      title: "All Referenda",
      tracks,
    },
  };
});
