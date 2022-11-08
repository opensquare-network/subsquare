import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  gov2ReferendumsTrackApi,
  gov2ReferendumsTracksApi,
  gov2ReferendumsTracksSummaryApi,
  gov2TracksApi,
} from "next-common/services/url";
import { EmptyList } from "next-common/utils/constants";
import { parseGov2TrackName } from "next-common/utils/gov2";
import { Gov2Page } from ".";
import Gov2TrackSummary from "next-common/components/summary/gov2TrackSummary";

export default withLoginUserRedux(
  ({ loginUser, chain, posts, title, tracks, summary, period }) => {
    const summaryComponent = (
      <Gov2TrackSummary summary={summary} period={period} />
    );

    return (
      <Gov2Page
        loginUser={loginUser}
        chain={chain}
        posts={posts}
        title={title}
        tracks={tracks}
        summary={summaryComponent}
      />
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page = 1, page_size: pageSize = 50, name } = context.query;

  const { result: tracks = [] } = await ssrNextApi.fetch(gov2TracksApi);
  const track = tracks.find((trackItem) => trackItem.name === name);

  const [{ result: posts }, { result: summary }, { result: period }] =
    await Promise.all([
      ssrNextApi.fetch(gov2ReferendumsTrackApi(track.id), {
        page,
        pageSize,
      }),
      ssrNextApi.fetch(gov2ReferendumsTracksSummaryApi(track.id)),
      ssrNextApi.fetch(gov2ReferendumsTracksApi(track.id)),
    ]);

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
      title: parseGov2TrackName(name),
      tracks,
      summary,
      period,
    },
  };
});
