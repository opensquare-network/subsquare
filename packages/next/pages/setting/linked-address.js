import Layout from "components/layout";
import Menu from "components/menu";
import { settingMenu } from "utils/constants";
import dynamic from "next/dynamic";
import {withLoginUser, withLoginUserRedux} from "../../lib";
import LayoutFixedHeader from "../../components/layoutFixedHeader";

const LinkedAddressComp = dynamic(() => import("components/linkedAddress"), {
  ssr: false,
});

export default withLoginUserRedux(({
  loginUser,
}) => {
  return (
    <LayoutFixedHeader user={loginUser} left={<Menu menu={settingMenu} />}>
      <LinkedAddressComp />
    </LayoutFixedHeader>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  return {
    props: {
    },
  };
});
