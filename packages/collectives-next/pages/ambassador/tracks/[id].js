import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import {
  ambassadorTrackApi,
  ambassadorTrackReferendaApi,
  ambassadorTrackReferendaSummaryApi,
  ambassadorTracksApi,
} from "next-common/services/url";
import { to404 } from "next-common/utils/serverSideUtil";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { EmptyList } from "next-common/utils/constants";
import { startCase } from "lodash-es";
import normalizeAmbassadorReferendaListItem from "next-common/utils/gov2/list/normalizeAmbassadorReferendaListItem";
import ListLayout from "next-common/components/layout/ListLayout";
import Gov2TrackSummary from "next-common/components/summary/gov2TrackSummary";
import PostList from "next-common/components/postList";
import businessCategory from "next-common/utils/consts/business/category";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function AmbassadorTrackPage({
  posts,
  title,
  track,
  detailedTracks,
  trackReferendaSummary,
}) {
  const seoInfo = { title, desc: title };
  const items = (posts.items || []).map((item) =>
    normalizeAmbassadorReferendaListItem(item, detailedTracks),
  );

  return (
    <CollectivesProvider section="ambassador">
      <ListLayout
        seoInfo={seoInfo}
        title={`[${track.id}] Origin: ${track.origin}`}
        description={track.description}
        summary={
          <Gov2TrackSummary
            summary={trackReferendaSummary}
            period={track}
            titleExtra={`[${track.id}]`}
          />
        }
      >
        <PostList
          title="List"
          titleCount={posts.total}
          category={businessCategory.ambassadorReferenda}
          items={items}
          pagination={{
            page: posts.page,
            pageSize: posts.pageSize,
            total: posts.total,
          }}
        />
      </ListLayout>
    </CollectivesProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { page = 1, page_size: pageSize = 50, id } = context.query;
  const { result: detailedTracks } = await backendApi.fetch(
    ambassadorTracksApi,
  );
  const track = detailedTracks.find(
    (item) => item.id === parseInt(id) || item.name === id,
  );
  if (!track) {
    return to404();
  }

  const [
    tracksProps,
    { result: posts },
    { result: trackReferendaSummary },
    { result: ambassadorTracksDetail },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    backendApi.fetch(ambassadorTrackReferendaApi(track?.id), {
      page,
      pageSize,
      simple: true,
    }),
    backendApi.fetch(ambassadorTrackReferendaSummaryApi(track?.id)),
    backendApi.fetch(ambassadorTrackApi(track?.id)),
  ]);

  return {
    props: {
      posts: posts ?? EmptyList,
      title: "Ambassador " + startCase(track.name),
      trackReferendaSummary: trackReferendaSummary ?? {},
      detailedTracks: ambassadorTracksDetail,
      track,
      ...tracksProps,
    },
  };
});
