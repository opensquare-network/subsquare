import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import DemocracyReferendaLayout from "next-common/components/layout/democracyLayout/referenda";
import KintsugiDemocracyStaking from "components/summary/kintsugiDemocracyStaking";
import normalizeReferendaListItem from "next-common/utils/viewfuncs/democracy/normalizeReferendaListItem";
import businessCategory from "next-common/utils/consts/business/category";

export default withLoginUserRedux(({ posts, chain, summary }) => {
  const items = (posts.items || []).map((item) =>
    normalizeReferendaListItem(chain, item),
  );
  const category = businessCategory.democracyReferenda;
  const title = "Democracy " + category;
  const seoInfo = {
    title,
    desc: title,
  };

  return (
    <DemocracyReferendaLayout
      seoInfo={seoInfo}
      title={seoInfo.title}
      summaryData={summary}
      summaryFooter={<KintsugiDemocracyStaking />}
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
