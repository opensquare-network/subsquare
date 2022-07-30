import dynamic from "next/dynamic";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SettingsLayout from "next-common/components/layout/settingsLayout";

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
    <SettingsLayout user={loginUser}>
      <NextHead title={`Settings`} desc={``} />
      <LinkedAddressComp chain={chain} />
    </SettingsLayout>
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
