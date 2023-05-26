import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import DemocracyStatistics from "next-common/components/statistics/democracy";
import AllVotesStatistics from "next-common/components/statistics/track/allVoteStatistics";
import TurnoutStatistics from "next-common/components/statistics/track/turnoutStatistics";
import BigNumber from "bignumber.js";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";

export default withLoginUserRedux(
  ({ delegatee, delegators, summary, turnout }) => {
    const chain = useChain();
    const isKusama = chain === Chains.kusama;

    return (
      <DetailLayout
        seoInfo={{
          title: "Democracy Statistics",
          desc: "Democracy Statistics",
        }}
      >
        <BreadcrumbWrapper>
          <Breadcrumb
            items={[
              {
                path: "/democracy/referenda",
                content: "Democracy",
              },
              {
                content: "Statistics",
              },
            ]}
          />
        </BreadcrumbWrapper>
        <AllVotesStatistics turnout={turnout} />
        <TurnoutStatistics turnout={turnout} />
        {!isKusama && (
          <DemocracyStatistics
            delegatee={delegatee}
            delegators={delegators}
            summary={summary}
          />
        )}
      </DetailLayout>
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

  const normailizedTurnout = turnout?.map((item) => ({
    ...item,
    totalCapital: item.turnout,
    directCapital: new BigNumber(item.turnout)
      .minus(item.delegationCapital)
      .toString(),
  }));

  return {
    props: {
      delegatee: delegatee ?? EmptyList,
      delegators: delegators ?? EmptyList,
      summary: summary ?? {},
      turnout: normailizedTurnout ?? [],
    },
  };
});
