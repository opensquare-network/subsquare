import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { EmptyList } from "next-common/utils/constants";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  gov2ReferendumsApi,
  gov2ReferendumsSummaryApi,
  gov2TracksApi,
} from "next-common/services/url";
import Gov2Summary from "next-common/components/summary/gov2Summary";
import Gov2Page from "components/gov2/gov2Page";

export default withLoginUserRedux(
  ({ loginUser, chain, posts, title, tracks, summary }) => {
    const summaryComponent = <Gov2Summary summary={summary} />;

    return (
      <Gov2Page
        loginUser={loginUser}
        chain={chain}
        posts={posts}
        title={title}
        tracks={tracks}
        summary={summaryComponent}
      />
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const { page = 1, page_size: pageSize = 50 } = context.query;

  const [{ result: tracks }, { result: posts }, { result: summary }] =
    await Promise.all([
      ssrNextApi.fetch(gov2TracksApi),
      ssrNextApi.fetch(gov2ReferendumsApi, {
        page,
        pageSize,
      }),
      ssrNextApi.fetch(gov2ReferendumsSummaryApi),
    ]);

  return {
    props: {
      posts: posts ?? EmptyList,
      title: "All Referenda",
      tracks: tracks ?? [],
      summary: summary ?? {},
    },
  };
});
