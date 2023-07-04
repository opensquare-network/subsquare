import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import DemocracyStatistics from "next-common/components/statistics/democracy";
import AllVotesStatistics from "next-common/components/statistics/track/allVoteStatistics";
import TurnoutStatistics from "next-common/components/statistics/track/turnoutStatistics";
import BigNumber from "bignumber.js";
import { useChainSettings } from "next-common/context/chain";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import DemocracyReferendaLayout from "next-common/components/layout/democracyLayout/referenda";

export default withLoginUserRedux(
  ({ delegatee, delegators, summary, turnout, referendumsSummary }) => {
    const { hasDemocracy } = useChainSettings();

    const title = "Democracy Statistics";
    const seoInfo = { title, desc: title };

    return (
      <DemocracyReferendaLayout
        seoInfo={seoInfo}
        title={title}
        summaryData={referendumsSummary}
      >
        <AllVotesStatistics turnout={turnout} />
        <TurnoutStatistics turnout={turnout} />
        {hasDemocracy !== false && (
          <DemocracyStatistics
            delegatee={delegatee}
            delegators={delegators}
            summary={summary}
          />
        )}
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

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      delegatee: delegatee ?? EmptyList,
      delegators: delegators ?? EmptyList,
      summary: summary ?? {},
      turnout: normailizedTurnout ?? [],

      referendumsSummary: referendumsSummary ?? {},

      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
