import { EmptyList } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import DemocracyStatistics from "next-common/components/statistics/democracy";
import TurnoutStatistics from "next-common/components/statistics/track/turnoutStatistics";
import BigNumber from "bignumber.js";
import { useChainSettings } from "next-common/context/chain";
import DemocracyReferendaLayout from "next-common/components/layout/democracyLayout/referenda";
import { Header } from "next-common/components/statistics/styled";
import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";
import VoteTrend from "next-common/components/statistics/track/voteTrend";
import AddressTrend from "next-common/components/statistics/track/addressTrend";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default function DemocracyStatisticsPage({
  delegatee,
  delegators,
  democracySummary,
  turnout,
  summary,
}) {
  const {
    modules: { democracy: hasDemocracyModule },
  } = useChainSettings();

  const title = "Democracy Statistics";
  const seoInfo = { title, desc: title };
  const [navCollapsed] = useNavCollapsed();

  return (
    <DemocracyReferendaLayout
      seoInfo={seoInfo}
      title={title}
      summaryData={summary}
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

        {hasDemocracyModule && (
          <div>
            <Header className="px-6 mb-4">Delegation</Header>
            <div className="mt-4">
              <DemocracyStatistics
                delegatee={delegatee}
                delegators={delegators}
                summary={democracySummary}
              />
            </div>
          </div>
        )}
      </div>
    </DemocracyReferendaLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const [
    { result: delegatee },
    { result: delegators },
    { result: democracySummary },
    { result: turnout },
  ] = await Promise.all([
    nextApi.fetch("democracy/delegatee", {
      sort: JSON.stringify(["delegatedVotes", "desc"]),
      pageSize: 25,
    }),
    nextApi.fetch("democracy/delegators", {
      sort: JSON.stringify(["votes", "desc"]),
      pageSize: 25,
    }),
    nextApi.fetch("democracy/summary"),
    nextApi.fetch("democracy/referenda/turnout"),
  ]);

  const normailizedTurnout = turnout?.map((item) => ({
    ...item,
    totalCapital: item.turnout,
    directCapital: new BigNumber(item.turnout)
      .minus(item.delegationCapital)
      .toString(),
  }));
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      delegatee: delegatee ?? EmptyList,
      delegators: delegators ?? EmptyList,
      democracySummary: democracySummary ?? {},
      turnout: normailizedTurnout ?? [],
      ...tracksProps,
    },
  };
});
