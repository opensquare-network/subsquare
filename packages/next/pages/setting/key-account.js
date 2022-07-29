import Menu from "next-common/components/menu";
import { settingMenuOfKeyAccount } from "next-common/utils/consts/menu/settings";
import Layout from "next-common/components/layout";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import { ContentWrapper, Wrapper } from "next-common/components/setting/styled";
import Web3Address from "next-common/components/setting/web3Address";
import NotificationEmail from "next-common/components/setting/notificationEmail";
import Logout from "next-common/components/setting/logout";
import { encodeAddressToChain } from "next-common/services/address";
import { useRouter } from "next/router";
import { isKeyRegisteredUser } from "next-common/utils";
import { useEffect } from "react";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Divider from "next-common/components/styled/layout/divider";

export default withLoginUserRedux(({ loginUser, chain }) => {
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
      <Layout
        chain={chain}
        user={loginUser}
        left={<Menu menu={settingMenuOfKeyAccount} />}
      >
        <NextHead title={`Settings`} desc={``} />
        <Wrapper>
          <TitleContainer>Account</TitleContainer>
          <ContentWrapper>
            <Web3Address address={address} chain={chain} />
            <Divider margin={24} />
            <NotificationEmail
              email={user?.email}
              verified={user?.emailVerified}
            />
            <Divider margin={24} />
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
