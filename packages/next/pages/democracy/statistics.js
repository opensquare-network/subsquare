import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import DemocracyStatistics from "next-common/components/statistics/democracy";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import AllVotesStatistics from "next-common/components/statistics/track/allVoteStatistics";
import TurnoutStatistics from "next-common/components/statistics/track/turnoutStatistics";
import BigNumber from "bignumber.js";

export default withLoginUserRedux(
  ({ tracks, fellowshipTracks, delegatee, delegators, summary, turnout }) => {
    const seoInfo = {
      title: "Democracy Statistics",
      desc: "Democracy Statistics",
    };

    const minWidth = (turnout.length || 0) * 60;

    return (
      <HomeLayout
        seoInfo={seoInfo}
        tracks={tracks}
        fellowshipTracks={fellowshipTracks}
      >
        <TitleContainer>Democracy Statistics</TitleContainer>
        <AllVotesStatistics turnout={turnout} minWidth={`${minWidth}px`} />
        <TurnoutStatistics turnout={turnout} minWidth={`${minWidth}px`} />
        <DemocracyStatistics
          delegatee={delegatee}
          delegators={delegators}
          summary={summary}
        />
      </HomeLayout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const [
    { result: delegatee },
    { result: delegators },
    { result: summary },
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

  const normailizedTurnout = turnout.map((item) => ({
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
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
      delegatee: delegatee ?? EmptyList,
      delegators: delegators ?? EmptyList,
      summary: summary ?? {},
      turnout: normailizedTurnout ?? {},
    },
  };
});
