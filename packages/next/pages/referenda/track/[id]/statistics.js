import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import HomeLayout from "next-common/components/layout/HomeLayout";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import { ssrNextApi } from "next-common/services/nextApi";
import startCase from "lodash.startcase";
import TrackStatistics from "next-common/components/statistics/track";
import { EmptyList } from "next-common/utils/constants";

export default withLoginUserRedux(
  ({
    track,
    turnout,
    tracks,
    fellowshipTracks,
    delegatee,
    delegators,
    summary,
  }) => {
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
        <BreadcrumbWrapper>
          <Breadcrumb
            items={[
              {
                path: "/referenda",
                content: "Referenda",
              },
              {
                path: `/referenda/track/${track.id}`,
                content: `[${track.id}] ${startCase(track.name)}`,
              },
              {
                content: "Statistics",
              },
            ]}
          />
        </BreadcrumbWrapper>
        <TrackStatistics
          track={track}
          turnout={turnout}
          delegatee={delegatee}
          delegators={delegators}
          summary={summary}
        />
      </HomeLayout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  const { result: tracks = [] } = await ssrNextApi.fetch(gov2TracksApi);
  const { result: fellowshipTracks = [] } = await ssrNextApi.fetch(
    fellowshipTracksApi
  );

  let track = tracks.find((trackItem) => trackItem.id === parseInt(id));
  if (!track) {
    track = tracks.find((item) => item.name === id);
  }
  if (!track) {
    return to404();
  }

  const [
    { result: turnout },
    { result: delegatee },
    { result: delegators },
    { result: summary },
  ] = await Promise.all([
    ssrNextApi.fetch(`referenda/tracks/${id}/turnout`),
    ssrNextApi.fetch(`referenda/tracks/${id}/delegatee`, {
      sort: JSON.stringify(["delegatedVotes", "desc"]),
      pageSize: 25,
    }),
    ssrNextApi.fetch(`referenda/tracks/${id}/delegators`, {
      sort: JSON.stringify(["votes", "desc"]),
      pageSize: 25,
    }),
    ssrNextApi.fetch(`referenda/tracks/${id}/summary`),
  ]);

  return {
    props: {
      track: track ?? {},
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
      turnout: turnout ?? [],
      delegatee: delegatee ?? EmptyList,
      delegators: delegators ?? EmptyList,
      summary: summary ?? {},
    },
  };
});
