import Layout from "components/layout";

import Overview from "components/overview";
import Menu from "components/menu";
import Trends from "components/trends";
import Footer from "components/footer";
import { mainMenu } from "utils/constants";
import {withLoginUser, withLoginUserRedux} from "../lib";

export default withLoginUserRedux(({
  loginUser,
}) => {
  return (
    <Layout
      user={loginUser}
      left={<Menu menu={mainMenu} />}
      right={
        <>
          <Trends />
          <Footer />
        </>
      }
    >
      <Overview />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  return {
    props: {
    },
  };
});
