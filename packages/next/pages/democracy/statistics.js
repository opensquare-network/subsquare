import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import DemocracyStatistics from "next-common/components/statistics/democracy";

export default withLoginUserRedux(({ delegatee, delegators }) => {
  const seoInfo = {
    title: "Democracy Statistics",
    desc: "Democracy Statistics",
  };

  return (
    <HomeLayout seoInfo={seoInfo}>
      <TitleContainer>Democracy Statistics</TitleContainer>
      <DemocracyStatistics delegatee={delegatee} delegators={delegators} />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const [
    { result: delegatee },
    { result: delegators },
  ] = await Promise.all([
    nextApi.fetch(
      "statistics/democracy/delegatee",
      {
        sort: JSON.stringify(["delegatedVotes", "desc"]),
        pageSize: 25,
      }
    ),
    nextApi.fetch(
      "statistics/democracy/delegators",
      {
        sort: JSON.stringify(["votes", "desc"]),
        pageSize: 25,
      }
    ),
  ]);

  return {
    props: {
      delegatee: delegatee ?? EmptyList,
      delegators: delegators ?? EmptyList,
    },
  };
});
