import { withLoginUser } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  gov2ReferendumsTrackApi,
  gov2TracksApi,
} from "next-common/services/url";
import { EmptyList } from "next-common/utils/constants";
import { parseGov2TrackName } from "next-common/utils/gov2";
import Gov2Page from ".";

export default Gov2Page;

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page = 1, page_size: pageSize = 50, name } = context.query;

  const { result: tracks = [] } = await ssrNextApi.fetch(gov2TracksApi);
  const track = tracks.find((trackItem) => trackItem.name === name);

  const { result: posts } = await ssrNextApi.fetch(
    gov2ReferendumsTrackApi(track.id),
    {
      page,
      pageSize,
    }
  );

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
      title: parseGov2TrackName(name),
      tracks,
    },
  };
});
