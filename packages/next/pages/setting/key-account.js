import Menu from "next-common/components/menu";
import { settingMenuOfKeyAccount } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import Layout from "components/layout";
import NextHead from "next-common/components/nextHead";
import {
  Wrapper,
  Title,
  ContentWrapper,
  Divider,
} from "components/setting/styled";
import Web3Address from "components/setting/web3Address";
import NotificationEmail from "components/setting/notificationEmail";
import Logout from "components/setting/logout";
import { encodeAddressToChain } from "next-common/services/address";
import { useRouter } from "next/router";
import { isKeyRegisteredUser } from "utils";
import { useEffect } from "react";

export default withLoginUserRedux(({ loginUser, chain }) => {
  const user = loginUser;
  const address = user?.publicKey ? encodeAddressToChain(
    Buffer.from(user?.publicKey, "hex"),
    chain
  ) : "";

  const router = useRouter();

  useEffect(() => {
    if (loginUser && !isKeyRegisteredUser(loginUser)) {
      router.push("/setting/account");
      return;
    }
  }, [loginUser, router])

  return (
    <>
      <Layout
        chain={chain}
        user={loginUser}
        left={<Menu menu={settingMenuOfKeyAccount} />}
      >
        <NextHead title={`Settings`} desc={``} />
        <Wrapper>
          <Title>Account</Title>
          <ContentWrapper>
            <Web3Address address={address} chain={chain} />
            <Divider />
            <NotificationEmail
              email={user?.email}
              verified={user?.emailVerified}
            />
            <Divider />
            <Logout />
          </ContentWrapper>
        </Wrapper>
      </Layout>
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
