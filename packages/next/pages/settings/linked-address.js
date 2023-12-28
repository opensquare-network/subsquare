import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SettingLayout from "next-common/components/layout/settingLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import { useIsLoggedIn, useUser } from "next-common/context/user";
import RequireSignature from "next-common/components/setting/requireSignature";

const LinkedAddressComp = dynamic(
  () => import("next-common/components/linkedAddress"),
  {
    ssr: false,
  },
);

export default function LinkedAddressPage() {
  const user = useUser();
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/");
    }
  }, [user, router]);

  if (user && !isLoggedIn) {
    return (
      <SettingLayout>
        <RequireSignature name="account" />
      </SettingLayout>
    );
  }

  return (
    <SettingLayout>
      <LinkedAddressComp />
    </SettingLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
