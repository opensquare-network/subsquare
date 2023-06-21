import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  fellowshipTracksApi,
  gov2ReferendumsApi,
  gov2ReferendumsSummaryApi,
  gov2TracksApi,
} from "next-common/services/url";
import Gov2Summary from "components/summary/gov2Summary";
import ReferendaStatusSelectField from "next-common/components/popup/fields/referendaStatusSelectField";
import { useRouter } from "next/router";
import { snakeCase, upperFirst, camelCase } from "lodash";
import ListLayout from "next-common/components/layout/ListLayout";
import PostList from "next-common/components/postList";
import normalizeGov2ReferendaListItem from "next-common/utils/gov2/list/normalizeReferendaListItem";
import businessCategory from "next-common/utils/consts/business/category";

export default withLoginUserRedux(
  ({ posts, title, tracks, summary, status }) => {
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
        title={title}
        description="All active and history referenda of various tracks."
        summary={<Gov2Summary summary={summary} />}
        tabs={[
          { label: "Referenda", url: "/referenda" },
          { label: "Statistics", url: "/referenda/statistics" },
        ]}
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
    status: statusQuery = "",
  } = context.query;

  const status = upperFirst(camelCase(statusQuery));

  const [
    { result: tracks },
    { result: fellowshipTracks },
    { result: posts },
    { result: summary },
  ] = await Promise.all([
    ssrNextApi.fetch(gov2TracksApi),
    ssrNextApi.fetch(fellowshipTracksApi),
    ssrNextApi.fetch(gov2ReferendumsApi, {
      page,
      pageSize,
      status,
    }),
    ssrNextApi.fetch(gov2ReferendumsSummaryApi),
  ]);

  return {
    props: {
      posts: posts ?? EmptyList,
      title: "All Referenda",
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
      summary: summary ?? {},
      status,
    },
  };
});
