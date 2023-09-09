import { withLoginUserRedux } from "next-common/lib";
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

export default withLoginUserRedux(() => {
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
});

export const getServerSideProps = getServerSidePropsWithTracks;
