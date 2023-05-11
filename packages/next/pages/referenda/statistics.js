import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import ReferendaStatistics from "next-common/components/statistics/referenda";

export default withLoginUserRedux(({ tracks, delegatee }) => {
  const seoInfo = {
    title: "OpenGov Statistics",
    desc: "OpenGov Statistics",
  };

  return (
    <HomeLayout seoInfo={seoInfo}>
      <TitleContainer>OpenGov Statistics</TitleContainer>
      <ReferendaStatistics tracks={tracks} delegatee={delegatee} />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const [{ result: tracks }, { result: delegatee }] = await Promise.all([
    nextApi.fetch("statistics/referenda/tracks"),
    nextApi.fetch("statistics/referenda/delegatee", {
      sort: JSON.stringify(["votes", "desc"]),
      pageSize: 25,
    }),
  ]);

  return {
    props: {
      tracks: tracks ?? [],
      delegatee: delegatee ?? EmptyList,
    },
  };
});
