import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import {
  fellowshipTracksApi,
  gov2ReferendumsTracksApi,
  gov2ReferendumsTracksSummaryApi,
  gov2TracksApi,
} from "next-common/services/url";
import { ssrNextApi } from "next-common/services/nextApi";
import TrackStatistics from "next-common/components/statistics/track";
import { EmptyList } from "next-common/utils/constants";
import { to404 } from "next-common/utils/serverSideUtil";
import ReferendaTrackLayout from "next-common/components/layout/referendaLayout/track";

export default withLoginUserRedux(
  ({
    track,
    turnout,
    delegatee,
    delegators,
    summary,

    referendumsSummary,
    period,
  }) => {
    const title = "OpenGov Statistics";
    const seoInfo = { title, desc: title };

    return (
      <ReferendaTrackLayout
        seoInfo={seoInfo}
        title={`[${period.id}] Origin: ${period.origin}`}
        summaryData={referendumsSummary}
        periodData={period}
      >
        <TrackStatistics
          track={track}
          turnout={turnout}
          delegatee={delegatee}
          delegators={delegators}
          summary={summary}
        />
      </ReferendaTrackLayout>
    );
  },
);

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  const { result: tracks = [] } = await ssrNextApi.fetch(gov2TracksApi);
  const { result: fellowshipTracks = [] } = await ssrNextApi.fetch(
    fellowshipTracksApi,
  );
  let track = tracks.find((trackItem) => trackItem.id === parseInt(id));
  if (!track) {
    track = tracks.find((item) => item.name === id);
  }
  if (!track) {
    return to404();
  }

  const [
    { result: turnout },
    { result: delegatee },
    { result: delegators },
    { result: summary },

    { result: referendumsSummary },
    { result: period },
  ] = await Promise.all([
    ssrNextApi.fetch(`referenda/tracks/${id}/turnout`),
    ssrNextApi.fetch(`referenda/tracks/${id}/delegatee`, {
      sort: JSON.stringify(["delegatedVotes", "desc"]),
      pageSize: 25,
    }),
    ssrNextApi.fetch(`referenda/tracks/${id}/delegators`, {
      sort: JSON.stringify(["votes", "desc"]),
      pageSize: 25,
    }),
    ssrNextApi.fetch(`referenda/tracks/${id}/summary`),

    ssrNextApi.fetch(gov2ReferendumsTracksSummaryApi(track?.id)),
    ssrNextApi.fetch(gov2ReferendumsTracksApi(track?.id)),
  ]);

  return {
    props: {
      track: track ?? {},
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
      turnout: turnout ?? [],
      delegatee: delegatee ?? EmptyList,
      delegators: delegators ?? EmptyList,
      summary: summary ?? {},

      referendumsSummary: referendumsSummary ?? {},
      period: period ?? {},
    },
  };
});
