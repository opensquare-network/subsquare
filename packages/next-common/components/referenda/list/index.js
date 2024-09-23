import ReferendaStatusSelectField from "next-common/components/popup/fields/referendaStatusSelectField";
import { useRouter } from "next/router";
import { flatten, snakeCase } from "lodash-es";
import PostList from "next-common/components/postList";
import normalizeGov2ReferendaListItem from "next-common/utils/gov2/list/normalizeReferendaListItem";
import businessCategory from "next-common/utils/consts/business/category";
import NewProposalButton from "next-common/components/summary/newProposalButton";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import UnVotedOnlyOption from "next-common/components/referenda/unVotedOnlyOption";
import { usePageProps } from "next-common/context/page";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  isLoadingReferendaVotingSelector,
  myReferendaVotingSelector,
} from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import { useActiveReferendaContext } from "next-common/context/activeReferenda";
import { getOpenGovReferendaPosts } from "next-common/utils/posts";
import { useAsync } from "react-use";

function useMyVotedReferenda() {
  const voting = useSelector(myReferendaVotingSelector);
  const isLoading = useSelector(isLoadingReferendaVotingSelector);
  const myVotedReferenda = useMemo(() => {
    return flatten(
      voting.map((item) =>
        (item.votes || []).map((vote) => vote.referendumIndex),
      ),
    );
  }, [voting]);
  return {
    myVotedReferenda,
    isLoading,
  };
}

function useUnVotedActiveReferenda() {
  const { activeReferenda, isLoadingActiveReferenda } =
    useActiveReferendaContext();
  const { myVotedReferenda, isLoading: isLoadingMyVotedReferenda } =
    useMyVotedReferenda();

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

  const { value: referenda, loading: isLoadingReferendaPosts } =
    useAsync(async () => {
      if (isLoadingUnVotedActiveReferenda) {
        return [];
      }
      return await getOpenGovReferendaPosts(unVotedActiveReferenda);
    }, [unVotedActiveReferenda, isLoadingUnVotedActiveReferenda]);

  const isLoading = isLoadingReferendaPosts || isLoadingUnVotedActiveReferenda;

  return {
    posts: referenda,
    isLoading,
  };
}

function ReferendaListFilters({
  status,
  isUnVotedOnlyLoading,
  isShowUnVotedOnly,
  setIsShowUnVotedOnly,
}) {
  const router = useRouter();
  const address = useRealAddress();

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

  return (
    <div className="flex flex-wrap gap-[12px] sm:items-center">
      {address && (
        <UnVotedOnlyOption
          isLoading={isUnVotedOnlyLoading}
          isOn={isShowUnVotedOnly}
          setIsOn={setIsShowUnVotedOnly}
        />
      )}
      <ReferendaStatusSelectField value={status} onChange={onStatusChange} />
      <NewProposalButton />
    </div>
  );
}

function WithFilterPostList({
  posts,
  total,
  isUnVotedOnlyLoading,
  isShowUnVotedOnly,
  setIsShowUnVotedOnly,
  pagination,
}) {
  const { tracks, status } = usePageProps();

  const items = (posts || []).map((item) =>
    normalizeGov2ReferendaListItem(item, tracks),
  );

  return (
    <PostList
      title="List"
      titleCount={total}
      titleExtra={
        <ReferendaListFilters
          status={status}
          isUnVotedOnlyLoading={isUnVotedOnlyLoading}
          isShowUnVotedOnly={isShowUnVotedOnly}
          setIsShowUnVotedOnly={setIsShowUnVotedOnly}
        />
      }
      category={businessCategory.openGovReferenda}
      items={items}
      pagination={pagination}
    />
  );
}

function PagedUnVotedOnlyList({
  posts,
  isUnVotedOnlyLoading,
  isShowUnVotedOnly,
  setIsShowUnVotedOnly,
}) {
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
      isShowUnVotedOnly={isShowUnVotedOnly}
      setIsShowUnVotedOnly={setIsShowUnVotedOnly}
      pagination={{
        page,
        pageSize,
        total,
        onPageChange: (_, page) => setPage(page),
      }}
    />
  );
}

export function UnVotedOnlyReferendaList({
  isShowUnVotedOnly,
  setIsShowUnVotedOnly,
}) {
  const { posts } = usePageProps();
  const { posts: unVotedPosts, isLoading } = useMyUnVotedReferendaPosts();

  if (isLoading) {
    return (
      <WithFilterPostList
        posts={posts.items}
        total={posts.total}
        isUnVotedOnlyLoading={isLoading}
        isShowUnVotedOnly={isShowUnVotedOnly}
        setIsShowUnVotedOnly={setIsShowUnVotedOnly}
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
      total={unVotedPosts.length}
      isUnVotedOnlyLoading={isLoading}
      isShowUnVotedOnly={isShowUnVotedOnly}
      setIsShowUnVotedOnly={setIsShowUnVotedOnly}
    />
  );
}

export function FullReferendaList({ isShowUnVotedOnly, setIsShowUnVotedOnly }) {
  const { posts } = usePageProps();

  return (
    <WithFilterPostList
      posts={posts.items}
      total={posts.total}
      isUnVotedOnlyLoading={false}
      isShowUnVotedOnly={isShowUnVotedOnly}
      setIsShowUnVotedOnly={setIsShowUnVotedOnly}
      pagination={{
        page: posts.page,
        pageSize: posts.pageSize,
        total: posts.total,
      }}
    />
  );
}
