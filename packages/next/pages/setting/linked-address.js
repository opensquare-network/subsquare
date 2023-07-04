import dynamic from "next/dynamic";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SettingLayout from "next-common/components/settingV2/settingLayout";

const LinkedAddressComp = dynamic(
  () => import("next-common/components/linkedAddressV2"),
  {
    ssr: false,
  },
);

export default withLoginUserRedux(({ loginUser }) => {
  const router = useRouter();

  useEffect(() => {
    if (loginUser === null) {
      router.push("/login");
    }
  }, [loginUser, router]);

  return (
    <SettingLayout>
      <LinkedAddressComp />
    </SettingLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  return {
    props: {},
  };
});
