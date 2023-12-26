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
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { withCommonProps } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import { getConnectedWallet } from "next-common/services/serverSide/getConnectedWallet";

export default function ProxyPage() {
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

export const getServerSideProps = withCommonProps(async (context) => {
  const connectedWallet = getConnectedWallet(context);
  let userPublicInfo = null;
  if (connectedWallet) {
    const { result } = await ssrNextApi.fetch(
      `/users/${connectedWallet.address}/public-info`,
    );
    userPublicInfo = result;
  }
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      userPublicInfo,
      ...tracksProps,
    },
  };
});
