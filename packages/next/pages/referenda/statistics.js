import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import ReferendaStatistics from "next-common/components/statistics/referenda";

export default withLoginUserRedux(({ tracks }) => {
  const seoInfo = {
    title: "OpenGov Statistics",
    desc: "OpenGov Statistics",
  };

  return (
    <HomeLayout seoInfo={seoInfo}>
      <TitleContainer>OpenGov Statistics</TitleContainer>
      <ReferendaStatistics tracks={tracks} />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const [{ result: tracks }] = await Promise.all([
    nextApi.fetch("statistics/referenda/tracks"),
  ]);

  return {
    props: {
      tracks: tracks ?? [],
    },
  };
});
