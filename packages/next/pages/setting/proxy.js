import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import {
  ContentWrapper,
  InfoMessage,
  Wrapper,
} from "next-common/components/setting/styled";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import SettingsLayout from "next-common/components/layout/settingsLayout";
import ProxyAddress from "next-common/components/setting/proxyAddress";

export default withLoginUserRedux(() => {
  return (
    <>
      <SettingsLayout>
        <NextHead title={`Settings`} desc={``} />
        <Wrapper>
          <TitleContainer>Proxy</TitleContainer>
          <ContentWrapper>
            <InfoMessage>
              All your transactions will be submitted on behalf of this proxy
              address.
            </InfoMessage>
            <ProxyAddress />
          </ContentWrapper>
        </Wrapper>
      </SettingsLayout>
    </>
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
