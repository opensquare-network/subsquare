import Layout from "next-common/components/layout";
import Menu from "next-common/components/menu";
import { settingMenu } from "next-common/utils/consts/menu/settings";
import dynamic from "next/dynamic";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import { useRouter } from "next/router";
import { useEffect } from "react";

const LinkedAddressComp = dynamic(
  () => import("next-common/components/linkedAddress"),
  {
    ssr: false,
  }
);

export default withLoginUserRedux(({ loginUser, chain }) => {
  const router = useRouter();

  useEffect(() => {
    if (loginUser === null) {
      router.push("/login");
    }
  }, [loginUser, router]);

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
