import { discussionData } from "utils/data";
import List from "components/list";
import Layout from "components/layout";
import Menu from "components/menu";
import Trends from "components/trends";
import Footer from "components/footer";
import { getMainMenu, mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "../../lib";
import nextApi from "../../services/nextApi";

export default withLoginUserRedux(
  ({ loginUser, OverviewData, page, discussionsCount }) => {
    return (
      <Layout
        user={loginUser}
        left={<Menu menu={getMainMenu({ discussionsCount })} />}
        right={
          <>
            <Trends user={loginUser} />
            <Footer />
          </>
        }
      >
        {OverviewData.map((list) => {
          return (
            <List
              key={list.categorygit}
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
  const { page } = context.query;

  const [{ result: posts }] = await Promise.all([
    nextApi.fetch("posts?chain=karura", { page_size: 2, page }),
  ]);

  const discussions = posts?.items?.map((post) => {
    const { author } = post;
    return {
      time: "just now",
      comments: post.commentsCount,
      title: post.title,
      author: post.author.username,
      authorEmailMd5: post.author.emailMd5,
      ...(author.addresses ? { address: author.addresses[0].address } : {}),
    };
  });

  return {
    props: {
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
