import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import CollectivesProvider from "next-common/context/collectives/collectives";
import nextApi from "next-common/services/nextApi";
import { fellowshipReferendumsSummaryApi } from "next-common/services/url";
import { Header } from "next-common/components/statistics/styled";
import FellowshipListLayout from "next-common/components/fellowship/fellowshipListLayout";
import FellowshipReferendaStatistics from "next-common/components/fellowship/referenda/statistics";

export default function FellowshipReferendaStatisticsPage({
  fellowshipSummary,
  tracksReferendaSummary,
}) {
  return (
    <CollectivesProvider section="fellowship">
      <FellowshipListLayout fellowshipSummary={fellowshipSummary}>
        <div>
          <Header className="px-6 mb-4">Referenda</Header>
          <FellowshipReferendaStatistics summary={tracksReferendaSummary} />
        </div>
      </FellowshipListLayout>
    </CollectivesProvider>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const [
    tracksProps,
    { result: fellowshipSummary },
    { result: tracksReferendaSummary },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    nextApi.fetch(fellowshipReferendumsSummaryApi),
    nextApi.fetch("fellowship/referenda/statistics"),
  ]);

  return {
    props: {
      fellowshipSummary: fellowshipSummary ?? {},
      tracksReferendaSummary: tracksReferendaSummary ?? [],
      ...tracksProps,
    },
  };
});
