import { useEffect } from "react";
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
import { useIsLoggedIn, useUser } from "next-common/context/user";
import { serverSidePropsWithSummary } from "next-common/services/serverSide/serverSidePropsWithSummary";
import RequireSignature from "next-common/components/setting/requireSignature";

export default function Account() {
  const router = useRouter();
  const user = useUser();
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (user === null) {
      router.push("/");
    }
    if (user && isKeyRegisteredUser(user)) {
      router.push("/settings/key-account");
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
      <SettingSection>
        <TitleContainer>Username</TitleContainer>
        <ContentWrapper>
          <Username username={user?.username} />
        </ContentWrapper>
      </SettingSection>
      <SettingSection>
        <TitleContainer>Email</TitleContainer>
        <ContentWrapper>
          <Email email={user?.email} verified={user?.emailVerified} />
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
  );
}

export const getServerSideProps = serverSidePropsWithSummary;
