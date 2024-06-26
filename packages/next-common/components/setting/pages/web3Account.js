import { ContentWrapper } from "next-common/components/setting/styled";
import Logout from "next-common/components/setting/logout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import SettingLayout from "next-common/components/layout/settingLayout";
import { useIsWeb3User, useUser } from "next-common/context/user";
import Profile from "../profile";

export default function Web3Account() {
  const user = useUser();
  const isWeb3User = useIsWeb3User();
  const address = user?.address || "";

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
    if (!isWeb3User) {
      router.push("/settings/account");
    }
  }, [user, isWeb3User, router]);

  return (
    <SettingLayout>
      <SettingSection>
        <TitleContainer>Profile</TitleContainer>
        <ContentWrapper>
          <Profile address={address} />
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
