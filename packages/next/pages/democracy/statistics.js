import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import DemocracyDelegatee from "next-common/components/statistics/democracy/delegatee";

export default withLoginUserRedux(({ delegatee }) => {
  const seoInfo = {
    title: "Democracy Statistics",
    desc: "Democracy Statistics",
  };

  return (
    <HomeLayout seoInfo={seoInfo}>
      <TitleContainer>Democracy Statistics</TitleContainer>
      <DemocracyDelegatee delegatee={delegatee} />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { result: delegatee } = await nextApi.fetch(
    "statistics/democracy/delegatee",
    {
      pageSize: 50,
    }
  );

  return {
    props: {
      delegatee: delegatee ?? EmptyList,
    },
  };
});
