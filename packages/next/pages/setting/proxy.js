import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import {
  ContentWrapper,
  InfoMessage,
} from "next-common/components/settingV2/styled";
import ProxyAddress from "next-common/components/setting/proxyAddress";
import SettingLayout from "next-common/components/settingV2/settingLayout";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";

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

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  return {
    props: {
      chain,
    },
  };
});
