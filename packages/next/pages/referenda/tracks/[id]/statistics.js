import { withCommonProps } from "next-common/lib";
import {
  gov2ReferendumsTracksApi,
  gov2ReferendumsTracksSummaryApi,
} from "next-common/services/url";
import { backendApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import ReferendaTrackLayout from "next-common/components/layout/referendaLayout/track";
import { Header } from "next-common/components/statistics/styled";
import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { usePageProps } from "next-common/context/page";
import ReferendaTrackNotFoundLayout from "next-common/components/layout/referendaLayout/trackNotFound";
import MaybeEmpty from "next-common/components/emptyList";

function TrackNotFound() {
  const { id } = usePageProps();
  return (
    <ReferendaTrackNotFoundLayout
      tabs={[
        {
          label: "Referenda",
          value: "referenda",
          url: `/referenda/tracks/${id}`,
        },
        {
          label: "Statistics",
          value: "statistics",
          url: `/referenda/tracks/${id}/statistics`,
        },
      ]}
      id={id}
    >
      <div className="space-y-6">
        <div>
          <Header className="px-6 mb-4">Referenda</Header>
          <div>
            <MaybeEmpty type="referenda" />
          </div>
        </div>

        <div>
          <Header className="px-6 mb-4">Delegation</Header>
          <div>
            <MaybeEmpty type="delegation" />
          </div>
        </div>
      </div>
    </ReferendaTrackNotFoundLayout>
  );
}

const VoteTrend = dynamicClientOnly(() =>
  import("next-common/components/statistics/track/voteTrend"),
);
const AddressTrend = dynamicClientOnly(() =>
  import("next-common/components/statistics/track/addressTrend"),
);
const TurnoutStatistics = dynamicClientOnly(() =>
  import("next-common/components/statistics/track/turnoutStatistics"),
);
const DemocracyStatistics = dynamicClientOnly(() =>
  import("next-common/components/statistics/democracy"),
);

export default function TrackStatisticsPage({
  track,
  turnout,
  delegatee,
  delegators,
  trackSummary,
  trackReferendaSummary,
  period,
}) {
  const title = "OpenGov Statistics";
  const seoInfo = { title, desc: title };
  const [navCollapsed] = useNavCollapsed();

  if (!period.id) {
    return <TrackNotFound />;
  }
  return (
    <ReferendaTrackLayout
      seoInfo={seoInfo}
      title={`[${period.id}] Origin: ${period.origin}`}
      summaryData={trackReferendaSummary}
      periodData={period}
    >
      <div className="space-y-6">
        <div>
          <Header className="px-6 mb-4">Referenda</Header>
          <div
            className={cn(
              "grid grid-cols-2 gap-4",
              !navCollapsed ? "max-md:grid-cols-1" : "max-sm:grid-cols-1",
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
              summary={trackSummary}
            />
          </div>
        </div>
      </div>
    </ReferendaTrackLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;

  const tracksProps = await fetchOpenGovTracksProps();
  const { tracks } = tracksProps;
  let track = tracks.find((trackItem) => trackItem.id === parseInt(id));
  if (!track) {
    track = tracks.find((item) => item.name === id);
  }

  const [
    { result: turnout },
    { result: delegatee },
    { result: delegators },
    { result: trackSummary },
    { result: trackReferendaSummary },
    { result: period },
  ] = await Promise.all([
    track ? backendApi.fetch(`referenda/tracks/${id}/turnout`) : {},
    track
      ? backendApi.fetch(`referenda/tracks/${id}/delegatee`, {
          sort: JSON.stringify(["delegatedVotes", "desc"]),
          pageSize: 25,
        })
      : {},
    track
      ? backendApi.fetch(`referenda/tracks/${id}/delegators`, {
          sort: JSON.stringify(["votes", "desc"]),
          pageSize: 25,
        })
      : {},
    track ? backendApi.fetch(`referenda/tracks/${id}/summary`) : {},
    track ? backendApi.fetch(gov2ReferendumsTracksSummaryApi(track.id)) : {},
    track ? backendApi.fetch(gov2ReferendumsTracksApi(track.id)) : {},
  ]);

  return {
    props: {
      track: track ?? {},
      turnout: turnout ?? [],
      delegatee: delegatee ?? EmptyList,
      delegators: delegators ?? EmptyList,
      trackSummary: trackSummary ?? {},
      trackReferendaSummary: trackReferendaSummary ?? {},
      period: period ?? {},
      ...tracksProps,
    },
  };
});
