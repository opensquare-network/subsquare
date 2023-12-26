import {
  ContentWrapper,
  InfoMessage,
} from "next-common/components/setting/styled";
import ProxyAddress from "next-common/components/setting/proxyAddress";
import SettingLayout from "next-common/components/layout/settingLayout";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import { useEffect } from "react";
import { useUser } from "next-common/context/user";
import { useRouter } from "next/router";
import { useConnectedWalletContext } from "next-common/context/connectedWallet";

export default function ProxyPage() {
  const loginUser = useUser();
  const router = useRouter();
  const { connectedWallet } = useConnectedWalletContext();

  useEffect(() => {
    if (!loginUser && !connectedWallet) {
      router.push("/");
    }
  }, [loginUser, connectedWallet, router]);

  return (
    <SettingLayout>
      <SettingSection>
        <TitleContainer>Proxy Address</TitleContainer>
        <ContentWrapper>
          <InfoMessage>
            All your transactions will be submitted on behalf of this proxy
            address.
          </InfoMessage>
          <ProxyAddress />
        </ContentWrapper>
      </SettingSection>
    </SettingLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
