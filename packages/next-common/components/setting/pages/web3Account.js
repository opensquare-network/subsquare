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
import ProxyAvatar from "../proxyAvatar";
import {
  GeneralProxiesProvider,
  useMyProxied,
} from "next-common/context/proxy";

function ProxyAvatarSection() {
  const { proxies, isLoading } = useMyProxied();
  if (isLoading || !proxies || !proxies.length) {
    return null;
  }

  return (
    <ContentWrapper>
      <ProxyAvatar />
    </ContentWrapper>
  );
}

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
        <div className="flex flex-col gap-[16px]">
          <ContentWrapper>
            <Profile address={address} />
          </ContentWrapper>
          <GeneralProxiesProvider>
            <ProxyAvatarSection />
          </GeneralProxiesProvider>
        </div>
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
