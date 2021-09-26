import Layout from "components/layout";
import Menu from "components/menu";
import { settingMenu } from "utils/constants";
import dynamic from "next/dynamic";
import {withLoginUser, withLoginUserRedux} from "../../lib";
import Layout from "../../components/layout";

const LinkedAddressComp = dynamic(() => import("components/linkedAddress"), {
  ssr: false,
});

export default withLoginUserRedux(({
  loginUser,
}) => {
  return (
    <Layout user={loginUser} left={<Menu menu={settingMenu} />}>
      <LinkedAddressComp />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  return {
    props: {
    },
  };
});
