import { withCommonProps } from "next-common/lib";
import {
  gov2ReferendumsTracksApi,
  gov2ReferendumsTracksSummaryApi,
} from "next-common/services/url";
import { ssrNextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { to404 } from "next-common/utils/serverSideUtil";
import ReferendaTrackLayout from "next-common/components/layout/referendaLayout/track";
import { Header } from "next-common/components/statistics/styled";
import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";
import VoteTrend from "next-common/components/statistics/track/voteTrend";
import AddressTrend from "next-common/components/statistics/track/addressTrend";
import TurnoutStatistics from "next-common/components/statistics/track/turnoutStatistics";
import DemocracyStatistics from "next-common/components/statistics/democracy";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default function TrackStatisticsPage({
  track,
  turnout,
  delegatee,
  delegators,
  summary,

  referendumsSummary,
  period,
}) {
  const title = "OpenGov Statistics";
  const seoInfo = { title, desc: title };
  const [navCollapsed] = useNavCollapsed();

  return (
    <ReferendaTrackLayout
      seoInfo={seoInfo}
      title={`[${period.id}] Origin: ${period.origin}`}
      summaryData={referendumsSummary}
      periodData={period}
    >
      <div className="space-y-6">
        <div>
          <Header className="px-6 mb-4">Referenda</Header>
          <div
            className={cn(
              "flex gap-4 flex-wrap",
              "[&_>_div]:min-w-[calc(50%-16px)] [&_>_div]:max-w-[calc(50%-8px)] [&_>_div]:flex-1",
              !navCollapsed ? "max-md:flex-col" : "max-sm:flex-col",
              !navCollapsed
                ? "[&_>_div]:max-md:max-w-full"
                : "[&_>_div]:max-sm:max-w-full",
            )}
          >
            <VoteTrend turnout={turnout} />
            <AddressTrend turnout={turnout} />
            <TurnoutStatistics turnout={turnout} />
          </div>
        </div>

        <div>
          <Header className="px-6 mb-4">Delegation</Header>
          <div>
            <DemocracyStatistics
              apiRoot={`referenda/tracks/${track.id}`}
              delegatee={delegatee}
              delegators={delegators}
              summary={summary}
            />
          </div>
        </div>
      </div>
    </ReferendaTrackLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;

  const { tracks, fellowshipTracks } = await fetchOpenGovTracksProps();
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
      tracks,
      fellowshipTracks,
      turnout: turnout ?? [],
      delegatee: delegatee ?? EmptyList,
      delegators: delegators ?? EmptyList,
      summary: summary ?? {},

      referendumsSummary: referendumsSummary ?? {},
      period: period ?? {},
    },
  };
});
