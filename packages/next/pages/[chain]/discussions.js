import List from "components/list";
import Layout from "components/layout";
import Menu from "components/menu";
import Trends from "components/trends";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "../../lib";
import nextApi from "../../services/nextApi";
import { EmptyList } from "../../utils/constants";

export default withLoginUserRedux(({ loginUser, posts, chain }) => {
  const items = (posts.items || []).map((post) => ({
    time: post.lastActivityAt,
    comments: post.commentsCount,
    title: post.title,
    author: post.author.username,
    authorEmailMd5: post.author.emailMd5,
    postUid: post.postUid,
    ...(post.author.addresses
      ? { address: post.author.addresses?.[0]?.address ?? null }
      : {}),
  }));

  const items = (posts.items || []).map((post) => ({
    chain: post.chain,
    time: post.lastActivityAt,
    comments: post.commentsCount,
    title: post.title,
    author: post.author.username,
    authorEmailMd5: post.author.emailMd5,
    postUid: post.postUid,
    ...(post.author.addresses
      ? { address: post.author.addresses?.[0]?.address ?? null }
      : {}),
  }));

  return (
    <Layout
      user={loginUser}
      left={<Menu menu={mainMenu} />}
      right={
        <>
          <Trends user={loginUser} chain={chain} />
          <Footer />
        </>
      }
    >
      <List
        category={"Discussion"}
        items={items}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
      />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, chain } = context.query;

  const [{ result: posts }] = await Promise.all([
    nextApi.fetch(`posts`, { chain, page, pageSize: 2 }),
  ]);

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
    },
  };
});
