import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import {
  gov2ReferendumsTrackApi,
  gov2ReferendumsTracksApi,
  gov2ReferendumsTracksSummaryApi,
  gov2TracksApi,
} from "next-common/services/url";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { startCase } from "lodash-es";
import { to404 } from "next-common/utils/serverSideUtil";
import ReferendaStatusSelectField from "next-common/components/popup/fields/referendaStatusSelectField";
import { useRouter } from "next/router";
import { camelCase, snakeCase, upperFirst } from "lodash-es";
import ReferendaTrackLayout from "next-common/components/layout/referendaLayout/track";
import PostList from "next-common/components/postList";
import normalizeGov2ReferendaListItem from "next-common/utils/gov2/list/normalizeReferendaListItem";
import businessCategory from "next-common/utils/consts/business/category";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import NewProposalButton from "next-common/components/summary/newProposalButton";
import {
  myReferendaDelegationsSelector,
  myReferendaVotingSelector,
} from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import { useSelector } from "react-redux";
import useFetchMyReferendaVoting from "next-common/components/myvotes/referenda/useFetchMyReferendaVoting";
import { mergeMyVoteToReferendaListItem } from "next-common/utils/gov2/list/mergeMyVoteToReferendaListItem";

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
  const voting = useSelector(myReferendaVotingSelector);
  const delegations = useSelector(myReferendaDelegationsSelector);

  const items = (posts.items || []).map((item) => {
    const normalizedItem = normalizeGov2ReferendaListItem(item, tracks);
    return mergeMyVoteToReferendaListItem(normalizedItem, voting, delegations);
  });

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
    <ReferendaTrackLayout
      seoInfo={seoInfo}
      title={`[${period.id}] Origin: ${period.origin}`}
      periodData={period}
      summaryData={trackReferendaSummary}
    >
      <PostList
        title="List"
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
        category={businessCategory.openGovReferenda}
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
  if (!track) {
    return to404();
  }

  const [
    { result: posts },
    { result: trackReferendaSummary },
    { result: period },
    { result: tracksDetail },
  ] = await Promise.all([
    nextApi.fetch(gov2ReferendumsTrackApi(track?.id), {
      page,
      pageSize,
      status,
      simple: true,
    }),
    nextApi.fetch(gov2ReferendumsTracksSummaryApi(track?.id)),
    nextApi.fetch(gov2ReferendumsTracksApi(track?.id)),
    nextApi.fetch(gov2TracksApi),
  ]);

  return {
    props: {
      track: track ?? null,
      tracksDetail: tracksDetail ?? null,
      posts: posts ?? EmptyList,
      title: "Referenda " + startCase(track.name),
      trackReferendaSummary: trackReferendaSummary ?? {},
      period: period ?? {},
      status,
      ...tracksProps,
    },
  };
});
