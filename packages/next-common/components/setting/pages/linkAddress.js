import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SettingLayout from "next-common/components/layout/settingLayout";
import { useIsAccountConnectedOnly, useUser } from "next-common/context/user";
import RequireSignature from "next-common/components/setting/requireSignature";

const LinkedAddressComp = dynamic(
  () => import("next-common/components/linkedAddress"),
  {
    ssr: false,
  },
);

export default function LinkedAddress() {
  const user = useUser();
  const router = useRouter();
  const isAccountConnectedOnly = useIsAccountConnectedOnly();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (isAccountConnectedOnly) {
    return (
      <SettingLayout>
        <RequireSignature name="link address" />
      </SettingLayout>
    );
  }

  return (
    <SettingLayout>
      <LinkedAddressComp />
    </SettingLayout>
  );
}
