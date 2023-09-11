import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import DemocracyStatistics from "next-common/components/statistics/democracy";
import TurnoutStatistics from "next-common/components/statistics/track/turnoutStatistics";
import BigNumber from "bignumber.js";
import { useChainSettings } from "next-common/context/chain";
import DemocracyReferendaLayout from "next-common/components/layout/democracyLayout/referenda";
import { Header } from "next-common/components/statistics/styled";
import clsx from "clsx";
import { useNavCollapsed } from "next-common/context/nav";
import VoteTrend from "next-common/components/statistics/track/voteTrend";
import AddressTrend from "next-common/components/statistics/track/addressTrend";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default withLoginUserRedux(
  ({ delegatee, delegators, summary, turnout, referendumsSummary }) => {
    const { hasDemocracy } = useChainSettings();

    const title = "Democracy Statistics";
    const seoInfo = { title, desc: title };
    const [navCollapsed] = useNavCollapsed();

    return (
      <DemocracyReferendaLayout
        seoInfo={seoInfo}
        title={title}
        summaryData={referendumsSummary}
      >
        <div className="space-y-6">
          <div>
            <Header className="px-6 mb-4">Referenda</Header>
            <div
              className={clsx(
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

          {hasDemocracy !== false && (
            <div>
              <Header className="px-6 mb-4">Delegation</Header>
              <div>
                <DemocracyStatistics
                  delegatee={delegatee}
                  delegators={delegators}
                  summary={summary}
                />
              </div>
            </div>
          )}
        </div>
      </DemocracyReferendaLayout>
    );
  },
);

export const getServerSideProps = withLoginUser(async (context) => {
  const [
    { result: delegatee },
    { result: delegators },
    { result: summary },
    { result: turnout },

    { result: referendumsSummary },
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

    nextApi.fetch("summary"),
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
      summary: summary ?? {},
      turnout: normailizedTurnout ?? [],

      referendumsSummary: referendumsSummary ?? {},
      ...tracksProps,
    },
  };
});
