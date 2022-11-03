import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { EmptyList } from "next-common/utils/constants";
import Gov2Layout from "next-common/components/layout/Gov2Layout";
import PostList from "next-common/components/postList";
// TODO: use this directly?
import DemocracySummary from "next-common/components/summary/democracySummary";
import businessCategory from "next-common/utils/consts/business/category";

export default withLoginUserRedux(({ loginUser, chain, posts }) => {
  // FIXME: seo
  const category = businessCategory.democracyReferenda;
  const seoInfo = { title: "", desc: "" };

  return (
    <Gov2Layout user={loginUser} seoInfo={seoInfo}>
      <PostList
        chain={chain}
        category={category}
        create={null}
        items={[]}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
        summary={<DemocracySummary chain={chain} />}
      />
    </Gov2Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  return {
    props: {
      chain,
      posts: EmptyList,
    },
  };
});
