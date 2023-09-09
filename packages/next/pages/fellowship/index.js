import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  fellowshipReferendumsApi,
  fellowshipReferendumsSummaryApi,
} from "next-common/services/url";
import ListLayout from "next-common/components/layout/ListLayout";
import PostList from "next-common/components/postList";
import normalizeFellowshipReferendaListItem from "next-common/utils/gov2/list/normalizeFellowshipReferendaListItem";
import businessCategory from "next-common/utils/consts/business/category";
import Gov2Summary from "next-common/components/summary/gov2Summary";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default withLoginUserRedux(({ posts, fellowshipTracks, summary }) => {
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
      summary={<Gov2Summary summary={summary} />}
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
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { page = 1, page_size: pageSize = defaultPageSize } = context.query;

  const [tracksProps, { result: posts }, { result: summary }] =
    await Promise.all([
      fetchOpenGovTracksProps(),
      ssrNextApi.fetch(fellowshipReferendumsApi, {
        page,
        pageSize,
      }),
      ssrNextApi.fetch(fellowshipReferendumsSummaryApi),
    ]);

  return {
    props: {
      posts: posts ?? EmptyList,
      ...tracksProps,
      summary: summary ?? {},
    },
  };
});
