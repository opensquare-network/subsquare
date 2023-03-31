import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  fellowshipReferendumsApi,
  fellowshipReferendumsSummaryApi,
  fellowshipTracksApi,
  gov2TracksApi,
} from "next-common/services/url";
import Gov2Summary from "components/summary/gov2Summary";
import FellowshipPage from "components/fellowship/fellowshipPage";

export default withLoginUserRedux(
  ({ posts, title, tracks, fellowshipTracks, summary }) => {
    const summaryComponent = <Gov2Summary summary={summary} />;

    return (
      <FellowshipPage
        posts={posts}
        title={title}
        tracks={tracks}
        fellowshipTracks={fellowshipTracks}
        summary={summaryComponent}
      />
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const { page = 1, page_size: pageSize = defaultPageSize } = context.query;

  const [
    { result: tracks },
    { result: fellowshipTracks },
    { result: posts },
    { result: summary },
  ] = await Promise.all([
    ssrNextApi.fetch(gov2TracksApi),
    ssrNextApi.fetch(fellowshipTracksApi),
    ssrNextApi.fetch(fellowshipReferendumsApi, {
      page,
      pageSize,
    }),
    ssrNextApi.fetch(fellowshipReferendumsSummaryApi),
  ]);

  return {
    props: {
      posts: posts ?? EmptyList,
      title: "All Fellowship Referenda",
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
      summary: summary ?? {},
    },
  };
});
