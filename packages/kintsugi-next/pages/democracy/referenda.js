import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import DemocracySummary from "next-common/components/summary/v2/democracySummary";
import ListLayout from "next-common/components/layout/ListLayout";
import KintsugiDemocracyStaking from "components/summary/kintsugiDemocracyStaking";
import normalizeReferendaListItem from "next-common/utils/viewfuncs/democracy/normalizeReferendaListItem";

export default withLoginUserRedux(({ posts, chain, summary }) => {
  const items = (posts.items || []).map((item) =>
    normalizeReferendaListItem(chain, item),
  );
  const category = "Referenda";
  const seoInfo = { title: "Democracy Referenda", desc: "Democracy Referenda" };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={seoInfo.title}
      description="Democracy uses public proposal, external proposal and referenda to mange the governance process."
      summary={<DemocracySummary summary={summary} />}
      summaryFooter={<KintsugiDemocracyStaking />}
      tabs={[
        { label: "Referenda", url: "/democracy/referenda" },
        { label: "Statistics", url: "/democracy/statistics" },
      ]}
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
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { page, page_size: pageSize } = context.query;

  const [{ result: posts }, { result: summary }] = await Promise.all([
    nextApi.fetch("democracy/referendums", {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
    nextApi.fetch("summary"),
  ]);

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
      summary: summary ?? {},
    },
  };
});
