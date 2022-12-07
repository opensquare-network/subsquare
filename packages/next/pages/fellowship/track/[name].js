import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  fellowshipTracksApi,
  fellowshipReferendumsTrackApi,
  fellowshipReferendumsTracksApi,
  fellowshipReferendumsTracksSummaryApi,
  gov2TracksApi,
} from "next-common/services/url";
import { EmptyList } from "next-common/utils/constants";
import { parseGov2TrackName } from "next-common/utils/gov2";
import Gov2TrackSummary from "components/summary/gov2TrackSummary";
import FellowshipPage from "components/fellowship/fellowshipPage";

export default withLoginUserRedux(
  ({ posts, title, tracks, fellowshipTracks, summary, period }) => {
    const summaryComponent = (
      <Gov2TrackSummary summary={summary} period={period} />
    );

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
  const { page = 1, page_size: pageSize = 50, name } = context.query;

  const { result: tracks = [] } = await ssrNextApi.fetch(gov2TracksApi);
  const { result: fellowshipTracks = [] } = await ssrNextApi.fetch(
    fellowshipTracksApi
  );

  const track = fellowshipTracks.find((trackItem) => trackItem.name === name);

  const [{ result: posts }, { result: summary }, { result: period }] =
    await Promise.all([
      ssrNextApi.fetch(fellowshipReferendumsTrackApi(track?.id), {
        page,
        pageSize,
      }),
      ssrNextApi.fetch(fellowshipReferendumsTracksSummaryApi(track?.id)),
      ssrNextApi.fetch(fellowshipReferendumsTracksApi(track?.id)),
    ]);

  return {
    props: {
      posts: posts ?? EmptyList,
      title: "Referenda " + parseGov2TrackName(name),
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
      summary,
      period: period ?? null,
    },
  };
});
