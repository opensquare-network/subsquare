import Layout from "components/layout";
import Menu from "components/menu";
import { settingMenu } from "utils/constants";
import dynamic from "next/dynamic";
import { withLoginUser, withLoginUserRedux } from "lib";
import NextHead from "../../components/nextHead";

const LinkedAddressComp = dynamic(() => import("components/linkedAddress"), {
  ssr: false,
});

export default withLoginUserRedux(({ loginUser, chain }) => {
  return (
    <Layout chain={chain} user={loginUser} left={<Menu menu={settingMenu} />}>
      <NextHead title={`Settings`} desc={``} />
      <LinkedAddressComp chain={chain} />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  return {
    props: {
      chain,
    },
  };
});
