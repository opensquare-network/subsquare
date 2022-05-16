import { useEffect } from "react";
import { useSelector } from "react-redux";
import Menu from "next-common/components/menu";
import { settingMenu } from "next-common/utils/constants";
import { userSelector } from "next-common/store/reducers/userSlice";
import { withLoginUser, withLoginUserRedux } from "lib";
import Layout from "components/layout";
import NextHead from "next-common/components/nextHead";
import {
  Wrapper,
  Title,
  ContentWrapper,
  Divider,
} from "next-common/components/setting/styled";
import Username from "next-common/components/setting/username";
import Email from "next-common/components/setting/email";
import Password from "next-common/components/setting/password";
import Logout from "next-common/components/setting/logout";
import { useRouter } from "next/router";
import { isKeyRegisteredUser } from "utils";

export default withLoginUserRedux(({ loginUser, chain }) => {
  const user = useSelector(userSelector);
  const router = useRouter();

  useEffect(() => {
    if (loginUser === null) {
      router.push("/login");
    }
    if (loginUser && isKeyRegisteredUser(loginUser)) {
      router.push("/setting/key-account");
    }
  }, [loginUser, router]);

  return (
    <>
      <Layout chain={chain} user={loginUser} left={<Menu menu={settingMenu} />}>
        <NextHead title={`Settings`} desc={``} />
        <Wrapper>
          <Title>Account</Title>
          <ContentWrapper>
            <Username username={user?.username} />
            <Divider />
            <Email email={user?.email} verified={user?.emailVerified} />
            <Divider />
            <Password />
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
