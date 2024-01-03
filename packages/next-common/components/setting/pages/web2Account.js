import { useEffect } from "react";
import { ContentWrapper } from "next-common/components/setting/styled";
import Username from "next-common/components/setting/username";
import Email from "next-common/components/setting/email";
import Password from "next-common/components/setting/password";
import Logout from "next-common/components/setting/logout";
import { useRouter } from "next/router";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import SettingLayout from "next-common/components/layout/settingLayout";
import {
  useIsAccountConnectedOnly,
  useIsWeb3User,
  useUser,
} from "next-common/context/user";
import RequireSignature from "next-common/components/setting/requireSignature";

export default function Web2Account() {
  const router = useRouter();
  const user = useUser();
  const isWeb3User = useIsWeb3User();
  const isAccountConnectedOnly = useIsAccountConnectedOnly();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
    if (isWeb3User) {
      router.push("/settings/key-account");
    }
  }, [user, isWeb3User, router]);

  if (isAccountConnectedOnly) {
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
