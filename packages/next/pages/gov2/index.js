import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { EmptyList } from "next-common/utils/constants";
import Gov2Layout from "next-common/components/layout/Gov2Layout";
import PostList from "next-common/components/postList";
import { toGov2ReferendaListItem } from "utils/viewfuncs";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  gov2ReferendumsApi,
  gov2ReferendumsSummaryApi,
  gov2TracksApi,
} from "next-common/services/url";
import Gov2Summary from "next-common/components/summary/gov2Summary";

export default withLoginUserRedux(
  ({ loginUser, chain, posts, title, tracks, summary }) => {
    // FIXME: seo
    const seoInfo = { title: "", desc: "" };
    const items = (posts.items || []).map((item) =>
      toGov2ReferendaListItem(chain, item, tracks)
    );

    console.log(posts);

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
          summary={<Gov2Summary chain={chain} summary={summary} />}
        />
      </Gov2Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page = 1, page_size: pageSize = 50 } = context.query;

  const [{ result: tracks }, { result: posts }] = await Promise.all([
    ssrNextApi.fetch(gov2TracksApi),
    ssrNextApi.fetch(gov2ReferendumsApi, {
      page,
      pageSize,
    }),
  ]);

  const { result: summary } = await ssrNextApi.fetch(gov2ReferendumsSummaryApi);

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
      title: "All Referenda",
      tracks,
      summary,
    },
  };
});
