import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import DemocracySummary from "next-common/components/summary/democracySummary";
import businessCategory from "next-common/utils/consts/business/category";
import HomeLayout from "next-common/components/layout/HomeLayout";
import DemocracySummaryFooter from "next-common/components/summary/democracySummaryFooter";
import normalizeProposalListItem from "next-common/utils/viewfuncs/democracy/normalizeProposalListItem";

export default withLoginUserRedux(({ proposals, chain }) => {
  const items = (proposals.items || []).map((item) =>
    normalizeProposalListItem(chain, item)
  );
  const category = businessCategory.democracyProposals;
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout seoInfo={seoInfo}>
      <PostList
        category={category}
        create={null}
        items={items}
        pagination={{
          page: proposals.page,
          pageSize: proposals.pageSize,
          total: proposals.total,
        }}
        summary={<DemocracySummary footer={<DemocracySummaryFooter />} />}
      />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: proposals }] = await Promise.all([
    nextApi.fetch("democracy/proposals", {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      proposals: proposals ?? EmptyList,
    },
  };
});
