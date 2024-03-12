import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import {
  fellowshipReferendumsTrackApi,
  fellowshipReferendumsTracksApi,
  fellowshipReferendumsTracksSummaryApi,
} from "next-common/services/url";
import { EmptyList } from "next-common/utils/constants";
import { startCase } from "lodash-es";
import { to404 } from "next-common/utils/serverSideUtil";
import ListLayout from "next-common/components/layout/ListLayout";
import normalizeFellowshipReferendaListItem from "next-common/utils/gov2/list/normalizeFellowshipReferendaListItem";
import PostList from "next-common/components/postList";
import businessCategory from "next-common/utils/consts/business/category";
import Gov2TrackSummary from "next-common/components/summary/gov2TrackSummary";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default function TrackPage({
  posts,
  title,
  fellowshipTracks,
  trackReferendaSummary,
  period,
}) {
  const seoInfo = { title, desc: title };
  const items = (posts.items || []).map((item) =>
    normalizeFellowshipReferendaListItem(item, fellowshipTracks),
  );

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={`[${period.id}] Origin: ${period.origin}`}
      description={period.description}
      summary={
        <Gov2TrackSummary
          summary={trackReferendaSummary}
          period={period}
          titleExtra={`[${period.id}]`}
        />
      }
    >
      <PostList
        title="List"
        titleCount={posts.total}
        category={businessCategory.fellowship}
        items={items}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
      />
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { page = 1, page_size: pageSize = 50, id } = context.query;

  const { tracks, fellowshipTracks, summary } = await fetchOpenGovTracksProps();
  let track = fellowshipTracks.find(
    (trackItem) => trackItem.id === parseInt(id),
  );
  if (!track) {
    track = fellowshipTracks.find((item) => item.name === id);
  }
  if (!track) {
    return to404();
  }

  const [
    { result: posts },
    { result: trackReferendaSummary },
    { result: period },
  ] = await Promise.all([
    nextApi.fetch(fellowshipReferendumsTrackApi(track?.id), {
      page,
      pageSize,
      simple: true,
    }),
    nextApi.fetch(fellowshipReferendumsTracksSummaryApi(track?.id)),
    nextApi.fetch(fellowshipReferendumsTracksApi(track?.id)),
  ]);

  return {
    props: {
      posts: posts ?? EmptyList,
      title: "Fellowship " + startCase(track.name),
      summary: summary ?? {},
      tracks,
      fellowshipTracks,
      trackReferendaSummary: trackReferendaSummary ?? {},
      period: period ?? {},
    },
  };
});
