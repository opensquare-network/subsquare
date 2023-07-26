import { withLoginUser, withLoginUserRedux } from "next-common/lib";
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
import { ssrNextApi } from "next-common/services/nextApi";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";

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
  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    ssrNextApi.fetch(gov2TracksApi),
    ssrNextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      chain,
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
