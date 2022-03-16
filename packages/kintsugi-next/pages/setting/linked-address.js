import Layout from "components/layout";
import Menu from "next-common/components/menu";
import { settingMenu } from "next-common/utils/constants";
import dynamic from "next/dynamic";
import { withLoginUser, withLoginUserRedux } from "lib";
import NextHead from "next-common/components/nextHead";

const LinkedAddressComp = dynamic(
  () => import("next-common/components/linkedAddress"),
  {
    ssr: false,
  }
);

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
