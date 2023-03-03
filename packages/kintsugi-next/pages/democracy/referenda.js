import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import DemocracySummary from "next-common/components/summary/democracySummary";
import HomeLayout from "next-common/components/layout/HomeLayout";
import KintsugiDemocracyStaking from "components/summary/kintsugiDemocracyStaking";
import normalizeReferendaListItem from "next-common/utils/viewfuncs/democracy/normalizeReferendaListItem";

export default withLoginUserRedux(({ posts, chain }) => {
  const items = (posts.items || []).map((item) =>
    normalizeReferendaListItem(chain, item)
  );
  const category = "Referenda";
  const seoInfo = { title: "Democracy Referenda", desc: "Democracy Referenda" };

  return (
    <HomeLayout seoInfo={seoInfo}>
      <PostList
        category={category}
        create={null}
        items={items}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
        summary={<DemocracySummary footer={<KintsugiDemocracyStaking />} />}
      />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { page, page_size: pageSize } = context.query;

  const [{ result: posts }] = await Promise.all([
    nextApi.fetch("democracy/referendums", {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
    },
  };
});
