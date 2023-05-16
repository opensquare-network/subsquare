import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import ReferendaStatistics from "next-common/components/statistics/referenda";
import ReferendaSummary from "next-common/components/statistics/referenda/summary";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";

export default withLoginUserRedux(
  ({ tracks, fellowshipTracks, tracksStats, delegatee, summary }) => {
    const seoInfo = {
      title: "OpenGov Statistics",
      desc: "OpenGov Statistics",
    };

    return (
      <HomeLayout
        seoInfo={seoInfo}
        tracks={tracks}
        fellowshipTracks={fellowshipTracks}
      >
        <TitleContainer>OpenGov Statistics</TitleContainer>
        <ReferendaSummary summary={summary} />
        <ReferendaStatistics tracks={tracksStats} delegatee={delegatee} />
      </HomeLayout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const [{ result: tracksStats }, { result: delegatee }, { result: summary }] =
    await Promise.all([
      ssrNextApi.fetch("referenda/tracks"),
      ssrNextApi.fetch("referenda/delegatee", {
        sort: JSON.stringify(["votes", "desc"]),
        pageSize: 25,
      }),
      ssrNextApi.fetch("referenda/summary"),
    ]);

  const { result: tracks = [] } = await ssrNextApi.fetch(gov2TracksApi);
  const { result: fellowshipTracks = [] } = await ssrNextApi.fetch(
    fellowshipTracksApi
  );

  return {
    props: {
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
      tracksStats: tracksStats ?? [],
      delegatee: delegatee ?? EmptyList,
      summary: summary ?? [],
    },
  };
});
