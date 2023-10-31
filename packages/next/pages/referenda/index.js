import { withCommonProps } from "next-common/lib";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  gov2ReferendumsApi,
  gov2ReferendumsSummaryApi,
} from "next-common/services/url";
import ReferendaStatusSelectField from "next-common/components/popup/fields/referendaStatusSelectField";
import { useRouter } from "next/router";
import { camelCase, snakeCase, upperFirst } from "lodash";
import ReferendaLayout from "next-common/components/layout/referendaLayout";
import PostList from "next-common/components/postList";
import normalizeGov2ReferendaListItem from "next-common/utils/gov2/list/normalizeReferendaListItem";
import businessCategory from "next-common/utils/consts/business/category";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default function ReferendaPage({
  posts,
  title,
  tracks,
  gov2ReferendaSummary,
  status,
}) {
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
    <ReferendaLayout
      seoInfo={seoInfo}
      title={title}
      summaryData={gov2ReferendaSummary}
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
    </ReferendaLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const {
    page = 1,
    page_size: pageSize = defaultPageSize,
    status: statusQuery = "",
  } = context.query;

  const status = upperFirst(camelCase(statusQuery));

  const [tracksProps, { result: posts }, { result: gov2ReferendaSummary }] =
    await Promise.all([
      fetchOpenGovTracksProps(),
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
      title: "OpenGov Referenda",
      ...tracksProps,
      gov2ReferendaSummary: gov2ReferendaSummary ?? {},
      status,
    },
  };
});
