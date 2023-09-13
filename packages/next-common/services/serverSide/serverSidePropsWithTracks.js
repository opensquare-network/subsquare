import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide/tracks";

export const getServerSidePropsWithTracks = withCommonProps(async () => {
  const tracksProps = await fetchOpenGovTracksProps();
  return {
    props: {
      ...tracksProps,
    },
  };
});
