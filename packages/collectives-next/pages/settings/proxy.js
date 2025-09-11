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

export default function ProxyPage() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <SettingLayout>
      <SettingSection>
        <TitleContainer>Proxy Address</TitleContainer>
        <ContentWrapper>
          <InfoMessage className="mb-4">
            All your transactions will be submitted on behalf of this proxied
            address.
          </InfoMessage>
          <ProxyAddress />
        </ContentWrapper>
      </SettingSection>
    </SettingLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
