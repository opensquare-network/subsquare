import { withCommonProps } from "next-common/lib";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import nextApi from "next-common/services/nextApi";
import {
  fellowshipReferendumsApi,
  fellowshipReferendumsSummaryApi,
  fellowshipTracksApi,
} from "next-common/services/url";
import PostList from "next-common/components/postList";
import normalizeFellowshipReferendaListItem from "next-common/utils/gov2/list/normalizeFellowshipReferendaListItem";
import businessCategory from "next-common/utils/consts/business/category";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import NewFellowshipProposalButton from "next-common/components/summary/newFellowshipProposalButton";
import CollectivesProvider from "next-common/context/collectives/collectives";
import UnVotedOnlyOption from "next-common/components/referenda/unVotedOnlyOption";
import useMyUnVotedCollectiveReferenda from "next-common/hooks/referenda/useMyUnVotedCollectiveReferenda";
import { useEffect, useMemo, useState } from "react";
import { usePageProps } from "next-common/context/page";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import {
  UnVotedOnlyStateProvider,
  useUnVotedOnlyState,
} from "next-common/components/referenda/list";
import FellowshipListLayout from "next-common/components/fellowship/fellowshipListLayout";
import { useMyCollectivesVotes } from "next-common/hooks/referenda/useMyCollectivesVotes";

function useMyUnVotedReferendaPosts() {
  const [posts, setPosts] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { myUnVotedReferenda, isLoading: isLoadingMyUnVotedReferenda } =
    useMyUnVotedCollectiveReferenda();

  useEffect(() => {
    if (isLoadingMyUnVotedReferenda) {
      return;
    }

    nextApi
      .fetch(
        `${fellowshipReferendumsApi}?simple=1&referendum_index=${myUnVotedReferenda.join(
          ",",
        )}`,
      )
      .then(({ result, error }) => {
        if (error) {
          setPosts([]);
          return;
        }
        setPosts(result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [myUnVotedReferenda, isLoadingMyUnVotedReferenda]);

  return {
    posts,
    isLoading,
  };
}

function WithFilterPostList({
  posts,
  total,
  isUnVotedOnlyLoading,
  pagination,
}) {
  const { fellowshipTracks } = usePageProps();
  const address = useRealAddress();
  const [isShowUnVotedOnly, setIsShowUnVotedOnly] = useUnVotedOnlyState();

  useMyCollectivesVotes();

  const items = (posts || []).map((item) =>
    normalizeFellowshipReferendaListItem(item, fellowshipTracks),
  );

  return (
    <PostList
      title="List"
      titleCount={total}
      titleExtra={
        <div className="flex gap-[12px] items-center">
          {address && (
            <UnVotedOnlyOption
              tooltip="Only referenda I can but haven't voted"
              isLoading={isUnVotedOnlyLoading}
              isOn={isShowUnVotedOnly}
              setIsOn={setIsShowUnVotedOnly}
            />
          )}
          <NewFellowshipProposalButton />
        </div>
      }
      category={businessCategory.fellowship}
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
  const [isShowUnVotedOnly] = useUnVotedOnlyState();
  return isShowUnVotedOnly ? <UnVotedOnlyList /> : <FullList />;
}

function ReferendaList() {
  return (
    <UnVotedOnlyStateProvider>
      <ReferendaListImpl />
    </UnVotedOnlyStateProvider>
  );
}

export default function FellowshipPage({ fellowshipSummary }) {
  return (
    <CollectivesProvider section="fellowship">
      <FellowshipListLayout fellowshipSummary={fellowshipSummary}>
        <ReferendaList />
      </FellowshipListLayout>
    </CollectivesProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { page = 1, page_size: pageSize = defaultPageSize } = context.query;

  const [
    tracksProps,
    { result: posts },
    { result: fellowshipSummary },
    { result: fellowshipTracksDetail },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    nextApi.fetch(fellowshipReferendumsApi, {
      page,
      pageSize,
      simple: true,
    }),
    nextApi.fetch(fellowshipReferendumsSummaryApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      posts: posts ?? EmptyList,
      fellowshipSummary: fellowshipSummary ?? {},
      fellowshipTracksDetail: fellowshipTracksDetail ?? null,
      ...tracksProps,
    },
  };
});
