import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { EmptyList } from "next-common/utils/constants";
import Gov2Layout from "next-common/components/layout/Gov2Layout";
import PostList from "next-common/components/postList";

export default withLoginUserRedux(({ loginUser, chain, posts }) => {
  // FIXME: seo
  const seoInfo = { title: "", desc: "" };

  return (
    <Gov2Layout user={loginUser} seoInfo={seoInfo}>
      <PostList
        chain={chain}
        create={null}
        items={[]}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
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
