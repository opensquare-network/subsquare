import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeReferendaListItem from "next-common/utils/viewfuncs/democracy/normalizeReferendaListItem";
import DemocracyReferendaLayout from "next-common/components/layout/democracyLayout/referenda";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default function DemocracyReferendaPage({ posts, chain, summary }) {
  const items = (posts.items || []).map((item) =>
    normalizeReferendaListItem(chain, item),
  );
  const category = businessCategory.democracyReferenda;
  const seoInfo = {
    title: category,
    desc: category,
  };

  return (
    <DemocracyReferendaLayout
      title={category}
      seoInfo={seoInfo}
      summaryData={summary}
    >
      <PostList
        category={category}
        title="List"
        titleCount={posts.total}
        items={items}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
      />
    </DemocracyReferendaLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const { result: posts } = await nextApi.fetch("democracy/referendums", {
    page: page ?? 1,
    pageSize: pageSize ?? defaultPageSize,
    simple: true,
  });
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
      ...tracksProps,
    },
  };
});
