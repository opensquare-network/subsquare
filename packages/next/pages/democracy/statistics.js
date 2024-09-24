import { EmptyList } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import BigNumber from "bignumber.js";
import { useChainSettings } from "next-common/context/chain";
import DemocracyReferendaLayout from "next-common/components/layout/democracyLayout/referenda";
import { Header } from "next-common/components/statistics/styled";
import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";

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

export default function DemocracyStatisticsPage({
  delegatee,
  delegators,
  democracySummary,
  turnout,
  summary,
}) {
  const {
    modules: { democracy },
  } = useChainSettings();

  const hasDemocracyModule = democracy && !democracy?.archived;

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
              "grid grid-cols-2 gap-4",
              !navCollapsed ? "max-md:grid-cols-1" : "max-sm:grid-cols-1",
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
