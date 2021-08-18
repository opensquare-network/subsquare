import List from "components/list";
import Layout from "components/layout";
import Menu from "components/menu";
import Trends from "components/trends";
import Footer from "components/footer";
import { getMainMenu, mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "../../lib";
import nextApi from "../../services/nextApi";

export default withLoginUserRedux(
  ({ loginUser, OverviewData, page, discussionsCount, chain }) => {
    return (
      <Layout
        user={loginUser}
        left={<Menu menu={getMainMenu({ discussionsCount })} />}
        right={
          <>
            <Trends user={loginUser} chain={chain} />
            <Footer />
          </>
        }
      >
        {OverviewData.map((list, index) => {
          return (
            <List
              key={index}
              category={list.category}
              items={list.items}
              pagination={{
                page: parseInt(page) ?? 1,
                pageSize: 2,
                total: discussionsCount,
              }}
            />
          );
        })}
      </Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, chain } = context.query;

  const [{ result: posts }] = await Promise.all([
    nextApi.fetch("posts?chain=karura", { page_size: 2, page }),
  ]);

  const discussions = posts?.items?.map((post) => {
    const { author } = post;
    return {
      time: post.lastActivityAt,
      comments: post.commentsCount,
      title: post.title,
      author: post.author.username,
      authorEmailMd5: post.author.emailMd5,
      postUid: post.postUid,
      ...(author.addresses
        ? { address: author.addresses?.[0]?.address ?? null }
        : {}),
    };
  });

  return {
    props: {
      chain,
      OverviewData: [
        {
          category: "Discussions",
          items: discussions,
        },
      ],
      discussionsCount: posts.total,
      page: page ?? 1,
    },
  };
});
