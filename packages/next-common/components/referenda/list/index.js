import PostList from "next-common/components/postList/referenda";
import normalizeGov2ReferendaListItem from "next-common/utils/gov2/list/normalizeReferendaListItem";
import { usePageProps } from "next-common/context/page";
import { useMemo, useState } from "react";
import { useActiveReferendaContext } from "next-common/context/activeReferenda";
import { getOpenGovReferendaPosts } from "next-common/utils/posts";
import { createStateContext, useAsync } from "react-use";
import useMyReferendaVotes from "next-common/hooks/referenda/useMyReferendaVotes";
import { UnVotedOnlyProvider, useUnVotedOnlyContext } from "./unVotedContext";

const [useIsTreasuryState, IsTreasuryStateProvider] = createStateContext(false);
const [useIsOngoingState, IsOngoingStateProvider] = createStateContext(false);

export { useIsTreasuryState, useIsOngoingState };

function useUnVotedActiveReferenda() {
  const { activeReferenda, isLoadingActiveReferenda } =
    useActiveReferendaContext();

  const { myVotedReferenda, isLoading: isLoadingMyVotedReferenda } =
    useMyReferendaVotes();

  const isLoading = isLoadingActiveReferenda || isLoadingMyVotedReferenda;

  const unVotedActiveReferenda = useMemo(() => {
    if (isLoading) {
      return;
    }
    const allActiveReferenda = activeReferenda.map(
      ({ referendumIndex }) => referendumIndex,
    );
    return allActiveReferenda.filter(
      (referendumIndex) => !myVotedReferenda.includes(referendumIndex),
    );
  }, [isLoading, myVotedReferenda, activeReferenda]);

  return {
    unVotedActiveReferenda,
    isLoading,
  };
}

function useMyUnVotedReferendaPosts() {
  const { unVotedActiveReferenda, isLoading: isLoadingUnVotedActiveReferenda } =
    useUnVotedActiveReferenda();
  const { status } = usePageProps();
  const [isTreasury] = useIsTreasuryState();
  const [ongoing] = useIsOngoingState();

  const { value: referenda, loading: isLoadingReferendaPosts } =
    useAsync(async () => {
      if (isLoadingUnVotedActiveReferenda) {
        return [];
      }
      return await getOpenGovReferendaPosts(unVotedActiveReferenda, {
        status,
        is_treasury: isTreasury,
        ongoing,
      });
    }, [
      unVotedActiveReferenda,
      isLoadingUnVotedActiveReferenda,
      status,
      isTreasury,
      ongoing,
    ]);

  const isLoading = isLoadingReferendaPosts || isLoadingUnVotedActiveReferenda;

  return {
    posts: referenda,
    isLoading,
  };
}

function WithFilterPostList({
  posts,
  total,
  isUnVotedOnlyLoading,
  pagination,
}) {
  const { tracks } = usePageProps();

  const items = useMemo(() => {
    return (posts || []).map((item) =>
      normalizeGov2ReferendaListItem(item, tracks),
    );
  }, [posts, tracks]);

  return (
    <PostList
      total={total}
      isUnVotedOnlyLoading={isUnVotedOnlyLoading}
      items={items}
      pagination={pagination}
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

export function UnVotedOnlyReferendaList() {
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

export function FullReferendaList() {
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
  return unVotedOnly ? <UnVotedOnlyReferendaList /> : <FullReferendaList />;
}

export function ReferendaList() {
  const { isTreasury, ongoing } = usePageProps();

  return (
    <IsTreasuryStateProvider initialValue={isTreasury === "true"}>
      <IsOngoingStateProvider initialValue={ongoing === "true"}>
        <UnVotedOnlyProvider>
          <ReferendaListImpl />
        </UnVotedOnlyProvider>
      </IsOngoingStateProvider>
    </IsTreasuryStateProvider>
  );
}
