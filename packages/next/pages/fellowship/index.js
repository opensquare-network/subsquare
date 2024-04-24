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

export default function FellowshipPage({
  posts,
  fellowshipTracks,
  fellowshipSummary,
}) {
  const title = "Fellowship Referenda";
  const seoInfo = { title, desc: title };

  const items = (posts.items || []).map((item) =>
    normalizeFellowshipReferendaListItem(item, fellowshipTracks),
  );

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description="All active and history referenda of various tracks."
      summary={<Gov2Summary summary={fellowshipSummary} />}
    >
      <PostList
        title="List"
        titleCount={posts.total}
        titleExtra={<NewFellowshipProposalButton />}
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
