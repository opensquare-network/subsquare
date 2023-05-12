import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import HomeLayout from "next-common/components/layout/HomeLayout";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import { ssrNextApi } from "next-common/services/nextApi";
import startCase from "lodash.startcase";
import TrackStatistics from "next-common/components/statistics/track";

export default withLoginUserRedux(({ track, turnout }) => {
  const seoInfo = {
    title: "OpenGov Statistics",
    desc: "OpenGov Statistics",
  };

  return (
    <HomeLayout seoInfo={seoInfo}>
      <BreadcrumbWrapper>
        <Breadcrumb items={[
          {
            path: "/referenda",
            content: "Referenda",
          },
          {
            path: `/referenda/track/${track.id}`,
            content: `#${track.id} ${startCase(track.name)}`,
          },
          {
            content: "Statistics",
          },
        ]} />
      </BreadcrumbWrapper>
      <TrackStatistics track={track} turnout={turnout} />
    </HomeLayout>
  );
});

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

  const { result: turnout } = await ssrNextApi.fetch(`statistics/referenda/tracks/${id}/turnout`);

  return {
    props: {
      track: track ?? {},
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
      turnout: turnout ?? [],
    },
  };
});
