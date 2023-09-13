import { EmptyList } from "next-common/utils/constants";
import { withLoginUser } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import DelegateeSummary from "next-common/components/statistics/referenda/delegateeSummary";
import ReferendaSummary from "next-common/components/statistics/referenda/summary";
import OpenGovTurnoutSummary from "next-common/components/statistics/referenda/turnoutSummary";
import TrackDelegationSummary from "next-common/components/statistics/referenda/trackDelegationSummary";
import DelegatedAddressSummary from "next-common/components/statistics/referenda/delegatedAddressSummary";
import ReferendaLayout from "next-common/components/layout/referendaLayout";
import { gov2ReferendumsSummaryApi } from "next-common/services/url";
import { Header } from "next-common/components/statistics/styled";
import clsx from "clsx";
import { useNavCollapsed } from "next-common/context/nav";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default function ReferendaStatisticsPage({
  tracksStats,
  delegatee,
  summary,
  referendumsSummary,
}) {
  const title = "OpenGov Statistics";
  const seoInfo = { title, desc: title };
  const [navCollapsed] = useNavCollapsed();

  return (
    <ReferendaLayout
      seoInfo={seoInfo}
      title={title}
      summaryData={referendumsSummary}
    >
      <div className="space-y-6">
        <div>
          <Header className="px-6 mb-4">Referenda</Header>
          <div
            className={clsx(
              "flex gap-4",
              "[&_>_div]:min-w-[calc(50%-16px)] [&_>_div]:flex-1",
              !navCollapsed ? "max-md:flex-col" : "max-sm:flex-col",
            )}
          >
            <ReferendaSummary summary={summary} />
            <OpenGovTurnoutSummary summary={summary} />
          </div>
        </div>

        <div>
          <Header className="px-6 mb-4">Delegation</Header>
          <div
            className={clsx(
              "flex gap-4",
              "[&_>_div]:min-w-[calc(50%-16px)] [&_>_div]:flex-1",
              !navCollapsed ? "max-md:flex-col" : "max-sm:flex-col",
            )}
          >
            <TrackDelegationSummary tracks={tracksStats} />
            <DelegatedAddressSummary tracks={tracksStats} />
          </div>
        </div>

        <div>
          <DelegateeSummary delegatee={delegatee} />
        </div>
      </div>
    </ReferendaLayout>
  );
}

export const getServerSideProps = withLoginUser(async (context) => {
  const [
    { result: tracksStats },
    { result: delegatee },
    { result: summary },
    tracksProps,
    { result: referendumsSummary },
  ] = await Promise.all([
    ssrNextApi.fetch("referenda/tracks"),
    ssrNextApi.fetch("referenda/delegatee", {
      sort: JSON.stringify(["votes", "desc"]),
      pageSize: 25,
    }),
    ssrNextApi.fetch("referenda/summary"),

    fetchOpenGovTracksProps(),
    ssrNextApi.fetch(gov2ReferendumsSummaryApi),
  ]);

  return {
    props: {
      tracksStats: tracksStats ?? [],
      delegatee: delegatee ?? EmptyList,
      summary: summary ?? [],

      ...tracksProps,
      referendumsSummary: referendumsSummary ?? {},
    },
  };
});
