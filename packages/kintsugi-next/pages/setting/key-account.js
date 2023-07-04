import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ContentWrapper } from "next-common/components/settingV2/styled";
import Web3Address from "next-common/components/settingV2/web3Address";
import Logout from "next-common/components/settingV2/logout";
import { encodeAddressToChain } from "next-common/services/address";
import { useRouter } from "next/router";
import { isKeyRegisteredUser } from "next-common/utils";
import { useEffect } from "react";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import SettingLayout from "next-common/components/settingV2/settingLayout";
import { useChain } from "next-common/context/chain";

export default withLoginUserRedux(({ loginUser }) => {
  const chain = useChain();
  const user = loginUser;
  const address = user?.publicKey
    ? encodeAddressToChain(Buffer.from(user?.publicKey, "hex"), chain)
    : "";

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
    <>
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
