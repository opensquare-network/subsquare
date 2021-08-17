import { discussionData } from "utils/data";
import List from "components/list";
import Layout from "components/layout";
import Menu from "components/menu";
import Trends from "components/trends";
import Footer from "components/footer";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "../../lib";
import nextApi from "../../services/nextApi";

export default withLoginUserRedux(({ loginUser, OverviewData }) => {
  return (
    <Layout
      user={loginUser}
      left={<Menu menu={mainMenu} />}
      right={
        <>
          <Trends user={loginUser} />
          <Footer />
        </>
      }
    >
      {OverviewData.map((list) => {
        return <List category={list.category} items={list.items} pagination />;
      })}
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { result: posts } = await nextApi.fetch("posts?chain=karura");

  const discussions = posts?.items?.map((post) => {
    return {
      time: "just now",
      comments: post.commentsCount,
      title: post.title,
      author: post.author.username,
      status: "Started",
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
    },
  };
});
