import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  fellowshipTracksApi,
  gov2ReferendumsTrackApi,
  gov2ReferendumsTracksApi,
  gov2ReferendumsTracksSummaryApi,
  gov2TracksApi,
} from "next-common/services/url";
import { EmptyList } from "next-common/utils/constants";
import startCase from "lodash.startcase";
import Gov2Page from "components/gov2/gov2Page";
import Gov2TrackSummary from "components/summary/gov2TrackSummary";
import { to404 } from "next-common/utils/serverSideUtil";
import StatisticLinkButton from "next-common/components/statisticsLinkButton";

export default withLoginUserRedux(
  ({ track, posts, title, tracks, fellowshipTracks, summary, period }) => {
    const summaryComponent = (
      <Gov2TrackSummary
        summary={summary}
        period={period}
        titleExtra={`[${period.id}]`}
      />
    );

    return (
      <Gov2Page
        posts={posts}
        title={title}
        tracks={tracks}
        fellowshipTracks={fellowshipTracks}
        summary={summaryComponent}
        topRightCorner={<StatisticLinkButton href={`/referenda/track/${track.id}/statistics`} />}
      />
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const { page = 1, page_size: pageSize = 50, id } = context.query;

  const { result: tracks = [] } = await ssrNextApi.fetch(gov2TracksApi);
  const { result: fellowshipTracks = [] } = await ssrNextApi.fetch(
    fellowshipTracksApi
  );

  let track = tracks.find((trackItem) => trackItem.id === parseInt(id));
  if (!track) {
    track = tracks.find((item) => item.name === id);
  }
  if (!track) {
    return to404();
  }

  const [{ result: posts }, { result: summary }, { result: period }] =
    await Promise.all([
      ssrNextApi.fetch(gov2ReferendumsTrackApi(track?.id), {
        page,
        pageSize,
      }),
      ssrNextApi.fetch(gov2ReferendumsTracksSummaryApi(track?.id)),
      ssrNextApi.fetch(gov2ReferendumsTracksApi(track?.id)),
    ]);

  return {
    props: {
      track: track ?? null,
      posts: posts ?? EmptyList,
      title: "Referenda " + startCase(track.name),
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
      summary: summary ?? {},
      period: period ?? {},
    },
  };
});
