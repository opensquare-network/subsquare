import dynamic from "next/dynamic";
import { withLoginUser } from "next-common/lib";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SettingLayout from "next-common/components/layout/settingLayout";
import { ssrNextApi } from "next-common/services/nextApi";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import { useUser } from "next-common/context/user";

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

export const getServerSideProps = withLoginUser(async (context) => {
  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    ssrNextApi.fetch(gov2TracksApi),
    ssrNextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
