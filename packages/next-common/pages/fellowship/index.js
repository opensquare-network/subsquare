import { withCommonProps } from "next-common/lib";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { backendApi } from "next-common/services/nextApi";
import {
  fellowshipReferendumsApi,
  fellowshipReferendumsSummaryApi,
  fellowshipTracksApi,
} from "next-common/services/url";
import FellowshipReferendaPostList from "next-common/components/postList/fellowshipReferendaPostList";
import normalizeFellowshipReferendaListItem from "next-common/utils/gov2/list/normalizeFellowshipReferendaListItem";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import NewFellowshipProposalButton from "next-common/components/summary/newFellowshipProposalButton";
import CollectivesProvider from "next-common/context/collectives/collectives";
import useMyUnVotedCollectiveReferenda from "next-common/hooks/referenda/useMyUnVotedCollectiveReferenda";
import { camelCase, isEmpty, upperFirst } from "lodash-es";
import { useMemo, useState } from "react";
import { usePageProps } from "next-common/context/page";
import {
  UnVotedOnlyProvider,
  useUnVotedOnlyContext,
} from "next-common/components/referenda/list/unVotedContext";
import FellowshipListLayout from "next-common/components/fellowship/fellowshipListLayout";
import FellowshipReferendaFilter from "next-common/components/fellowship/referenda/filter";
import TrackPanel from "next-common/components/referenda/trackPanel";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import { useAsync } from "react-use";

function useMyUnVotedReferendaPosts() {
  const { status } = usePageProps();
  const { myUnVotedReferenda, isLoading: isLoadingMyUnVotedReferenda } =
    useMyUnVotedCollectiveReferenda();

  const { value: posts, loading: isLoadingPosts } = useAsync(async () => {
    if (isLoadingMyUnVotedReferenda || isEmpty(myUnVotedReferenda)) {
      return [];
    }

    const { result, error } = await backendApi.fetch(fellowshipReferendumsApi, {
      simple: 1,
      referendumIndex: myUnVotedReferenda.join(","),
      ...status,
    });

    return error ? [] : result ?? [];
  }, [myUnVotedReferenda, isLoadingMyUnVotedReferenda, status]);

  return {
    posts,
    isLoading: isLoadingMyUnVotedReferenda || isLoadingPosts,
  };
}

function WithFilterPostList({
  posts,
  total,
  isUnVotedOnlyLoading,
  pagination,
}) {
  const { fellowshipTracks } = usePageProps();

  const items = (posts || []).map((item) =>
    normalizeFellowshipReferendaListItem(item, fellowshipTracks),
  );

  return (
    <FellowshipReferendaPostList
      items={items}
      pagination={pagination}
      titleCount={isUnVotedOnlyLoading ? "Filtering un-voted..." : total}
      titleExtra={
        <div className="flex gap-[12px] items-center">
          <FellowshipReferendaFilter
            isUnVotedOnlyLoading={isUnVotedOnlyLoading}
          />
          <NewFellowshipProposalButton />
        </div>
      }
    />
  );
}

function PagedUnVotedOnlyList({ posts, isUnVotedOnlyLoading }) {
  const [page, setPage] = useState(1);
  const pageSize = 25;
  const total = posts.length || 0;

  const pagedItems = useMemo(
    () => posts.slice((page - 1) * pageSize, page * pageSize),
    [page, pageSize, posts],
  );

  return (
    <WithFilterPostList
      posts={pagedItems}
      total={total}
      isUnVotedOnlyLoading={isUnVotedOnlyLoading}
      pagination={{
        page,
        pageSize,
        total,
        onPageChange: (_, page) => setPage(page),
      }}
    />
  );
}

function UnVotedOnlyList() {
  const { posts } = usePageProps();
  const { posts: unVotedPosts, isLoading } = useMyUnVotedReferendaPosts();

  if (isLoading) {
    return (
      <WithFilterPostList
        posts={posts.items}
        total={posts.total}
        isUnVotedOnlyLoading={isLoading}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
      />
    );
  }

  return (
    <PagedUnVotedOnlyList
      posts={unVotedPosts}
      isUnVotedOnlyLoading={isLoading}
    />
  );
}

function FullList() {
  const { posts } = usePageProps();

  return (
    <WithFilterPostList
      posts={posts.items}
      total={posts.total}
      isUnVotedOnlyLoading={false}
      pagination={{
        page: posts.page,
        pageSize: posts.pageSize,
        total: posts.total,
      }}
    />
  );
}

function ReferendaListImpl() {
  const { unVotedOnly } = useUnVotedOnlyContext();
  return unVotedOnly ? <UnVotedOnlyList /> : <FullList />;
}

function ReferendaList() {
  return (
    <UnVotedOnlyProvider>
      <ReferendaListImpl />
    </UnVotedOnlyProvider>
  );
}

export default function FellowshipPage({ fellowshipSummary }) {
  return (
    <MigrationConditionalApiProvider>
      <CollectivesProvider section="fellowship">
        <FellowshipListLayout fellowshipSummary={fellowshipSummary}>
          <TrackPanel className="mb-4" />
          <ReferendaList />
        </FellowshipListLayout>
      </CollectivesProvider>
    </MigrationConditionalApiProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const {
    page = 1,
    page_size: pageSize = defaultPageSize,
    status = "",
  } = context.query;
  const normalizedStatus = upperFirst(camelCase(status));

  const [
    tracksProps,
    { result: posts },
    { result: fellowshipSummary },
    { result: fellowshipTracksDetail },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    backendApi.fetch(fellowshipReferendumsApi, {
      page,
      pageSize,
      simple: true,
      ...(normalizedStatus ? { status: normalizedStatus } : {}),
    }),
    backendApi.fetch(fellowshipReferendumsSummaryApi),
    backendApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      posts: posts ?? EmptyList,
      fellowshipSummary: fellowshipSummary ?? {},
      fellowshipTracksDetail: fellowshipTracksDetail ?? null,
      status: normalizedStatus ?? {},
      ...tracksProps,
    },
  };
});
