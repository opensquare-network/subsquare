import { withCommonProps } from "next-common/lib";
import { ContentWrapper } from "next-common/components/setting/styled";
import Web3Address from "next-common/components/setting/web3Address";
import Logout from "next-common/components/setting/logout";
import { encodeAddressToChain } from "next-common/services/address";
import { useRouter } from "next/router";
import { isKeyRegisteredUser } from "next-common/utils";
import { useEffect } from "react";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import SettingLayout from "next-common/components/layout/settingLayout";
import { useChain } from "next-common/context/chain";
import { useUser } from "next-common/context/user";

export default function KeyAccount() {
  const chain = useChain();
  const loginUser = useUser();
  const user = loginUser;
  const address = user?.publicKey
    ? encodeAddressToChain(Buffer.from(user?.publicKey, "hex"), chain)
    : "";

  const router = useRouter();

  useEffect(() => {
    if (loginUser === null) {
      router.push("/");
    }
    if (loginUser && !isKeyRegisteredUser(loginUser)) {
      router.push("/settings/account");
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
}

export const getServerSideProps = withCommonProps();
