import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import {
  gov2ReferendumsTrackApi,
  gov2ReferendumsTracksApi,
  gov2ReferendumsTracksSummaryApi,
  gov2TracksApi,
} from "next-common/services/url";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import {
  camelCase,
  isEmpty,
  snakeCase,
  startCase,
  upperFirst,
} from "lodash-es";
import ReferendaStatusSelectField from "next-common/components/popup/fields/referendaStatusSelectField";
import { useRouter } from "next/router";
import ReferendaTrackLayout from "next-common/components/layout/referendaLayout/track";
import ReferendaPostList from "next-common/components/postList/referendaPostList";
import normalizeGov2ReferendaListItem from "next-common/utils/gov2/list/normalizeReferendaListItem";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import NewProposalButton from "next-common/components/summary/newProposalButton";
import useFetchMyReferendaVoting from "next-common/components/myvotes/referenda/useFetchMyReferendaVoting";
import dynamic from "next/dynamic";
import { usePageProps } from "next-common/context/page";
import ReferendaTrackNotFoundLayout from "next-common/components/layout/referendaLayout/trackNotFound";

function TrackNotFound() {
  const { id } = usePageProps();
  return (
    <ReferendaTrackNotFoundLayout
      tabs={[
        {
          label: "Referenda",
          value: "referenda",
          url: `/referenda/tracks/${id}`,
        },
        {
          label: "Statistics",
          value: "statistics",
          url: `/referenda/tracks/${id}/statistics`,
        },
      ]}
      id={id}
    >
      <TrackPanel className="mb-4" />
      <ReferendaPostList items={[]} />
    </ReferendaTrackNotFoundLayout>
  );
}

const TrackPanel = dynamic(
  () => import("next-common/components/referenda/trackPanel"),
  {
    ssr: false,
  },
);

export default function TrackPage({
  posts,
  title,
  tracks,
  trackReferendaSummary,
  period,
  status,
}) {
  useFetchMyReferendaVoting();

  const router = useRouter();

  if (isEmpty(period)) {
    return <TrackNotFound />;
  }

  const items = (posts.items || []).map((item) =>
    normalizeGov2ReferendaListItem(item, tracks),
  );

  function onStatusChange(status) {
    const q = router.query;

    delete q.page;
    if (status) {
      q.status = snakeCase(status);
    } else {
      delete q.status;
    }

    router.replace({ query: q });
  }

  const seoInfo = { title, desc: title };

  return (
    <ReferendaTrackLayout
      seoInfo={seoInfo}
      title={`[${period.id}] Origin: ${period.origin}`}
      periodData={period}
      summaryData={trackReferendaSummary}
    >
      <TrackPanel className="mb-4" />
      <ReferendaPostList
        titleCount={posts.total}
        titleExtra={
          <div className="flex gap-[12px] items-center">
            <ReferendaStatusSelectField
              value={status}
              onChange={onStatusChange}
            />
            <NewProposalButton />
          </div>
        }
        items={items}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
      />
    </ReferendaTrackLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const {
    page = 1,
    page_size: pageSize = defaultPageSize,
    id,
    status: statusQuery = "",
  } = context.query;

  const status = upperFirst(camelCase(statusQuery));

  const tracksProps = await fetchOpenGovTracksProps();
  const { tracks } = tracksProps;
  let track = tracks.find((trackItem) => trackItem.id === parseInt(id));
  if (!track) {
    track = tracks.find((item) => item.name === id);
  }

  const [
    { result: posts },
    { result: trackReferendaSummary },
    { result: period },
    { result: tracksDetail },
  ] = await Promise.all([
    track
      ? backendApi.fetch(gov2ReferendumsTrackApi(track?.id), {
          page,
          pageSize,
          status,
          simple: true,
        })
      : {},
    track ? backendApi.fetch(gov2ReferendumsTracksSummaryApi(track?.id)) : {},
    track ? backendApi.fetch(gov2ReferendumsTracksApi(track?.id)) : {},
    backendApi.fetch(gov2TracksApi),
  ]);

  return {
    props: {
      track: track ?? null,
      tracksDetail: tracksDetail ?? null,
      posts: posts ?? EmptyList,
      title: "Referenda " + startCase(track?.name),
      trackReferendaSummary: trackReferendaSummary ?? {},
      period: period ?? {},
      status,
      ...tracksProps,
    },
  };
});
