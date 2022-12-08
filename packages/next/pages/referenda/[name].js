import { withLoginUser } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import { gov2TracksApi } from "next-common/services/url";
import { to404 } from "next-common/utils/serverSideUtil";

export default function track() {
  return "Please visit `/referenda/track/[track_id]`";
}

export const getServerSideProps = withLoginUser(async (context) => {
  const { name } = context.query;
  const { result: tracks = [] } = await ssrNextApi.fetch(gov2TracksApi);

  const track = tracks.find((item) => item.name === name);
  if (!track) {
    return to404(context);
  }

  return {
    redirect: {
      permanent: true,
      destination: `/referenda/track/${track.id}`,
    },
  };
});
