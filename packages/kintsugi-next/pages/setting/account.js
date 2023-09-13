import { useEffect } from "react";
import { withLoginUser } from "next-common/lib";
import { ContentWrapper } from "next-common/components/setting/styled";
import Username from "next-common/components/setting/username";
import Email from "next-common/components/setting/email";
import Password from "next-common/components/setting/password";
import Logout from "next-common/components/setting/logout";
import { useRouter } from "next/router";
import { isKeyRegisteredUser } from "next-common/utils";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import SettingLayout from "next-common/components/layout/settingLayout";
import { ssrNextApi } from "next-common/services/nextApi";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import { useUser } from "next-common/context/user";

export default function Account() {
  const loginUser = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loginUser === null) {
      router.push("/");
    }
    if (loginUser && isKeyRegisteredUser(loginUser)) {
      router.push("/setting/key-account");
    }
  }, [loginUser, router]);

  return (
    <>
      <SettingLayout>
        <SettingSection>
          <TitleContainer>Username</TitleContainer>
          <ContentWrapper>
            <Username username={loginUser?.username} />
          </ContentWrapper>
        </SettingSection>
        <SettingSection>
          <TitleContainer>Email</TitleContainer>
          <ContentWrapper>
            <Email
              email={loginUser?.email}
              verified={loginUser?.emailVerified}
            />
          </ContentWrapper>
        </SettingSection>
        <SettingSection>
          <TitleContainer>Change Password</TitleContainer>
          <ContentWrapper>
            <Password />
          </ContentWrapper>
        </SettingSection>
        <SettingSection>
          <TitleContainer>Logout</TitleContainer>
          <ContentWrapper>
            <Logout />
          </ContentWrapper>
        </SettingSection>
      </SettingLayout>
    </>
  );
}

export const getServerSideProps = withLoginUser(async () => {
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
