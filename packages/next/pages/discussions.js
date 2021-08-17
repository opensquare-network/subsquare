import { discussionData } from "utils/data";
import List from "components/list";
import Layout from "components/layout";
import Menu from "components/menu";
import Trends from "components/trends";
import Footer from "components/footer";
import { mainMenu } from "utils/constants";
import { withLoginUser, withLoginUserRedux } from "../lib";

export default withLoginUserRedux(({ loginUser }) => {
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
      <List
        category={discussionData.category}
        items={discussionData.items}
        pagination
      />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  return {
    props: {},
  };
});
