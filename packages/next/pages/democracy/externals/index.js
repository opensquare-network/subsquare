import PostList from "next-common/components/postList";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import businessCategory from "next-common/utils/consts/business/category";
import normalizeExternalListItem from "next-common/utils/viewfuncs/democracy/normliazeExternalListItem";
import ListLayout from "next-common/components/layout/ListLayout";
import DemocracySummary from "next-common/components/summary/v2/democracySummary";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default function DemocracyExternalsPage({ externals, chain, summary }) {
  const items = (externals.items || []).map((item) =>
    normalizeExternalListItem(chain, item),
  );
  const category = businessCategory.democracyExternals;
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="Democracy uses public proposal, external proposal and referenda to manage the governance process."
      summary={<DemocracySummary summary={summary} />}
    >
      <PostList
        category={category}
        title="List"
        titleCount={externals.total}
        items={items}
        pagination={{
          page: externals.page,
          pageSize: externals.pageSize,
          total: externals.total,
        }}
      />
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const { result: externals } = await nextApi.fetch("democracy/externals", {
    page: page ?? 1,
    pageSize: pageSize ?? defaultPageSize,
    simple: true,
  });
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      chain,
      externals: externals ?? EmptyList,
      ...tracksProps,
    },
  };
});
