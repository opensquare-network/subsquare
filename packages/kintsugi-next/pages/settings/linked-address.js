import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SettingLayout from "next-common/components/layout/settingLayout";
import { useUser } from "next-common/context/user";
import { serverSidePropsWithSummary } from "next-common/services/serverSide/serverSidePropsWithSummary";

const LinkedAddressComp = dynamic(
  () => import("next-common/components/linkedAddress"),
  {
    ssr: false,
  },
);

export default function LinkedAddress() {
  const loginUser = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loginUser === null) {
      router.push("/");
    }
  }, [loginUser, router]);

  return (
    <SettingLayout>
      <LinkedAddressComp />
    </SettingLayout>
  );
}

export const getServerSideProps = serverSidePropsWithSummary;
