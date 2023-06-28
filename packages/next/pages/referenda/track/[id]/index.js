import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  fellowshipTracksApi,
  gov2ReferendumsTrackApi,
  gov2ReferendumsTracksApi,
  gov2ReferendumsTracksSummaryApi,
  gov2TracksApi,
} from "next-common/services/url";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import startCase from "lodash.startcase";
import Gov2TrackSummary from "components/summary/gov2TrackSummary";
import { to404 } from "next-common/utils/serverSideUtil";
import ReferendaStatusSelectField from "next-common/components/popup/fields/referendaStatusSelectField";
import { useRouter } from "next/router";
import { camelCase, upperFirst, snakeCase } from "lodash";
import ListLayout from "next-common/components/layout/ListLayout";
import PostList from "next-common/components/postList";
import normalizeGov2ReferendaListItem from "next-common/utils/gov2/list/normalizeReferendaListItem";
import businessCategory from "next-common/utils/consts/business/category";
import Gov2TrackSummaryFooter from "components/summary/gov2TrackSummaryFooter";

export default withLoginUserRedux(
  ({ posts, title, tracks, summary, period, status }) => {
    const router = useRouter();

    const items = (posts.items || []).map((item) =>
      normalizeGov2ReferendaListItem(item, tracks),
    );

    function onStatusChange(item) {
      const q = router.query;

      delete q.page;
      if (item.value) {
        q.status = snakeCase(item.value);
      } else {
        delete q.status;
      }

      router.replace({ query: q });
    }

    const seoInfo = { title, desc: title };

    return (
      <ListLayout
        seoInfo={seoInfo}
        title={`[${period.id}] Origin: ${period.origin}`}
        description={period.description}
        tabs={[
          { label: "Referenda", url: `/referenda/track/${period.id}` },
          {
            label: "Statistics",
            url: `/referenda/track/${period.id}/statistics`,
          },
        ]}
        summary={
          <Gov2TrackSummary
            summary={summary}
            period={period}
            titleExtra={`[${period.id}]`}
          />
        }
        summaryFooter={<Gov2TrackSummaryFooter period={period} />}
      >
        <PostList
          title="List"
          titleCount={posts.total}
          titleExtra={
            <ReferendaStatusSelectField
              value={status}
              onChange={onStatusChange}
            />
          }
          category={businessCategory.openGovReferenda}
          items={items}
          pagination={{
            page: posts.page,
            pageSize: posts.pageSize,
            total: posts.total,
          }}
        />
      </ListLayout>
    );
  },
);

export const getServerSideProps = withLoginUser(async (context) => {
  const {
    page = 1,
    page_size: pageSize = defaultPageSize,
    id,
    status: statusQuery = "",
  } = context.query;

  const status = upperFirst(camelCase(statusQuery));

  const { result: tracks = [] } = await ssrNextApi.fetch(gov2TracksApi);
  const { result: fellowshipTracks = [] } = await ssrNextApi.fetch(
    fellowshipTracksApi,
  );

  let track = tracks.find((trackItem) => trackItem.id === parseInt(id));
  if (!track) {
    track = tracks.find((item) => item.name === id);
  }
  if (!track) {
    return to404();
  }

  const [{ result: posts }, { result: summary }, { result: period }] =
    await Promise.all([
      ssrNextApi.fetch(gov2ReferendumsTrackApi(track?.id), {
        page,
        pageSize,
        status,
      }),
      ssrNextApi.fetch(gov2ReferendumsTracksSummaryApi(track?.id)),
      ssrNextApi.fetch(gov2ReferendumsTracksApi(track?.id)),
    ]);

  return {
    props: {
      track: track ?? null,
      posts: posts ?? EmptyList,
      title: "Referenda " + startCase(track.name),
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
      summary: summary ?? {},
      period: period ?? {},
      status,
    },
  };
});
