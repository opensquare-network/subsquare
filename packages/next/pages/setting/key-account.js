import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import Web3Address from "next-common/components/settingV2/web3Address";
import Logout from "next-common/components/settingV2/logout";
import { useRouter } from "next/router";
import { isKeyRegisteredUser } from "next-common/utils";
import { useEffect } from "react";
import SettingLayout from "next-common/components/settingV2/settingLayout";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import { ContentWrapper } from "next-common/components/settingV2/styled";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import { ssrNextApi } from "next-common/services/nextApi";

export default withLoginUserRedux(({ loginUser }) => {
  const user = loginUser;
  const address = user?.address || "";

  const router = useRouter();

  useEffect(() => {
    if (loginUser === null) {
      router.push("/login");
    }
    if (loginUser && !isKeyRegisteredUser(loginUser)) {
      router.push("/setting/account");
    }
  }, [loginUser, router]);

  return (
    <SettingLayout>
      <SettingSection>
        <TitleContainer>Web3 Address</TitleContainer>
        <ContentWrapper>
          <Web3Address address={address} />
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
