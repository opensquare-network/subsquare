import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  fellowshipTracksApi,
  gov2ReferendumsApi,
  gov2ReferendumsSummaryApi,
  gov2TracksApi,
} from "next-common/services/url";
import Gov2Summary from "components/summary/gov2Summary";
import Gov2Page from "components/gov2/gov2Page";
import StatisticLinkButton from "next-common/components/statisticsLinkButton";

export default withLoginUserRedux(
  ({ posts, title, tracks, fellowshipTracks, summary }) => {
    const summaryComponent = <Gov2Summary summary={summary} />;

    return (
      <Gov2Page
        posts={posts}
        title={title}
        tracks={tracks}
        fellowshipTracks={fellowshipTracks}
        summary={summaryComponent}
        topRightCorner={<StatisticLinkButton href="/referenda/statistics" />}
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
      fellowshipTracks: fellowshipTracks ?? [],
      summary: summary ?? {},
    },
  };
});
