import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  gov2ReferendumsTrackApi,
  gov2ReferendumsTracksApi,
  gov2ReferendumsTracksSummaryApi,
  gov2TracksApi,
} from "next-common/services/url";
import { EmptyList } from "next-common/utils/constants";
import { parseGov2TrackName } from "next-common/utils/gov2";
import Gov2Page from "components/gov2/gov2Page";
import Gov2TrackSummary from "components/summary/gov2TrackSummary";

export default withLoginUserRedux(
  ({ posts, title, tracks, summary, period }) => {
    const summaryComponent = (
      <Gov2TrackSummary summary={summary} period={period} />
    );

    return (
      <Gov2Page
        posts={posts}
        title={title}
        tracks={tracks}
        summary={summaryComponent}
      />
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const { page = 1, page_size: pageSize = 50, name } = context.query;

  const { result: tracks = [] } = await ssrNextApi.fetch(gov2TracksApi);
  const track = tracks.find((trackItem) => trackItem.name === name);

  const [{ result: posts }, { result: summary }, { result: period }] =
    await Promise.all([
      ssrNextApi.fetch(gov2ReferendumsTrackApi(track.id), {
        page,
        pageSize,
      }),
      ssrNextApi.fetch(gov2ReferendumsTracksSummaryApi(track.id)),
      ssrNextApi.fetch(gov2ReferendumsTracksApi(track.id)),
    ]);

  return {
    props: {
      posts: posts ?? EmptyList,
      title: "Referenda " + parseGov2TrackName(name),
      tracks,
      summary,
      period,
    },
  };
});
