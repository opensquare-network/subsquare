import { withCommonProps } from "next-common/lib";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import nextApi from "next-common/services/nextApi";
import {
  fellowshipReferendumsApi,
  fellowshipReferendumsSummaryApi,
  fellowshipTracksApi,
} from "next-common/services/url";
import ListLayout from "next-common/components/layout/ListLayout";
import PostList from "next-common/components/postList";
import normalizeFellowshipReferendaListItem from "next-common/utils/gov2/list/normalizeFellowshipReferendaListItem";
import businessCategory from "next-common/utils/consts/business/category";
import Gov2Summary from "next-common/components/summary/gov2Summary";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import NewFellowshipProposalButton from "next-common/components/summary/newFellowshipProposalButton";
import CollectivesProvider from "next-common/context/collectives/collectives";
import UnVotedOnlyOption from "next-common/components/referenda/unVotedOnlyOption";
import useSubAllMyUnVotedReferenda from "next-common/hooks/referenda/useSubAllMyUnVotedReferenda";
import { useEffect, useState } from "react";
import { usePageProps } from "next-common/context/page";

function useMyUnVotedReferendaPosts() {
  const [posts, setPosts] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { myUnVotedReferenda } = useSubAllMyUnVotedReferenda();
  // console.log({ myUnVotedReferenda, isLoading });

  useEffect(() => {
    if (!myUnVotedReferenda) {
      return;
    }
    //TODO: fetch posts of myUnVotedReferenda
    setPosts([]);
    setIsLoading(false);
  }, [myUnVotedReferenda]);

  return {
    posts,
    isLoading,
  };
}

function UnVotedOnlyList({ isShowUnVotedOnly, setIsShowUnVotedOnly }) {
  const { posts, fellowshipTracks } = usePageProps();

  const { posts: unVotedPosts, isLoading } = useMyUnVotedReferendaPosts();

  if (isLoading) {
    const items = (posts.items || []).map((item) =>
      normalizeFellowshipReferendaListItem(item, fellowshipTracks),
    );

    return (
      <PostList
        title="List"
        titleCount={posts.total}
        titleExtra={
          <div className="flex gap-[12px] items-center">
            <UnVotedOnlyOption
              isLoading={isLoading}
              isOn={isShowUnVotedOnly}
              setIsOn={setIsShowUnVotedOnly}
            />
            <NewFellowshipProposalButton />
          </div>
        }
        category={businessCategory.fellowship}
        items={items}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
      />
    );
  }

  const items = (unVotedPosts || []).map((item) =>
    normalizeFellowshipReferendaListItem(item, fellowshipTracks),
  );

  return (
    <PostList
      title="List"
      titleCount={unVotedPosts.total}
      titleExtra={
        <div className="flex gap-[12px] items-center">
          <UnVotedOnlyOption
            isLoading={isLoading}
            isOn={isShowUnVotedOnly}
            setIsOn={setIsShowUnVotedOnly}
          />
          <NewFellowshipProposalButton />
        </div>
      }
      category={businessCategory.fellowship}
      items={items}
    />
  );
}

function FullList({ isShowUnVotedOnly, setIsShowUnVotedOnly }) {
  const { posts, fellowshipTracks } = usePageProps();

  const items = (posts.items || []).map((item) =>
    normalizeFellowshipReferendaListItem(item, fellowshipTracks),
  );

  return (
    <PostList
      title="List"
      titleCount={posts.total}
      titleExtra={
        <div className="flex gap-[12px] items-center">
          <UnVotedOnlyOption
            isOn={isShowUnVotedOnly}
            setIsOn={setIsShowUnVotedOnly}
          />
          <NewFellowshipProposalButton />
        </div>
      }
      category={businessCategory.fellowship}
      items={items}
      pagination={{
        page: posts.page,
        pageSize: posts.pageSize,
        total: posts.total,
      }}
    />
  );
}

export default function FellowshipPage({ fellowshipSummary }) {
  const title = "Fellowship Referenda";
  const seoInfo = { title, desc: title };

  const [isShowUnVotedOnly, setIsShowUnVotedOnly] = useState(false);

  return (
    <CollectivesProvider>
      <ListLayout
        seoInfo={seoInfo}
        title={title}
        description="All active and history referenda in various tracks."
        summary={<Gov2Summary summary={fellowshipSummary} />}
      >
        {isShowUnVotedOnly ? (
          <UnVotedOnlyList
            isShowUnVotedOnly={isShowUnVotedOnly}
            setIsShowUnVotedOnly={setIsShowUnVotedOnly}
          />
        ) : (
          <FullList
            isShowUnVotedOnly={isShowUnVotedOnly}
            setIsShowUnVotedOnly={setIsShowUnVotedOnly}
          />
        )}
      </ListLayout>
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
