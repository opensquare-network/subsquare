import { EmptyList } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import ReferendaLayout from "next-common/components/layout/referendaLayout";
import { gov2ReferendumsSummaryApi } from "next-common/services/url";
import { Header } from "next-common/components/statistics/styled";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";

const ReferendaSummaryStats = dynamicClientOnly(() =>
  import("next-common/components/statistics/referenda/summaryStats"),
);
const ReferendaDelegationStats = dynamicClientOnly(() =>
  import("next-common/components/statistics/referenda/delegationStats"),
);

export default function ReferendaStatisticsPage({
  tracksStats,
  delegatee,
  tracksReferendaSummary,
  gov2ReferendaSummary,
}) {
  const title = "OpenGov Statistics";
  const seoInfo = { title, desc: title };

  return (
    <ReferendaLayout
      seoInfo={seoInfo}
      title={title}
      summaryData={gov2ReferendaSummary}
    >
      <div className="space-y-6">
        <div>
          <Header className="px-6 mb-4">Referenda</Header>
          <ReferendaSummaryStats summary={tracksReferendaSummary} />
        </div>

        <div>
          <Header className="px-6 mb-4">Delegation</Header>

          <div className="space-y-4">
            <ReferendaDelegationStats
              tracksStats={tracksStats}
              delegatee={delegatee}
              delegationSummary={tracksReferendaSummary?.delegation}
            />
          </div>
        </div>
      </div>
    </ReferendaLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const [
    { result: tracksStats },
    { result: delegatee },
    { result: tracksReferendaSummary },
    { result: gov2ReferendaSummary },
    tracksProps,
  ] = await Promise.all([
    backendApi.fetch("referenda/tracks"),
    backendApi.fetch("referenda/delegatee", {
      sort: JSON.stringify(["votes", "desc"]),
      pageSize: 25,
    }),
    backendApi.fetch("referenda/summary"),
    backendApi.fetch(gov2ReferendumsSummaryApi),
    fetchOpenGovTracksProps(),
  ]);

  return {
    props: {
      tracksStats: tracksStats ?? [],
      delegatee: delegatee ?? EmptyList,
      tracksReferendaSummary: tracksReferendaSummary ?? [],
      gov2ReferendaSummary: gov2ReferendaSummary ?? {},
      ...tracksProps,
    },
  };
});
