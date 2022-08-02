import { useEffect } from "react";
import { useSelector } from "react-redux";
import { userSelector } from "next-common/store/reducers/userSlice";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import { ContentWrapper, Wrapper } from "next-common/components/setting/styled";
import Username from "next-common/components/setting/username";
import Email from "next-common/components/setting/email";
import Password from "next-common/components/setting/password";
import Logout from "next-common/components/setting/logout";
import { useRouter } from "next/router";
import { isKeyRegisteredUser } from "next-common/utils";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Divider from "next-common/components/styled/layout/divider";
import SettingsLayout from "next-common/components/layout/settingsLayout";

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
      <SettingsLayout user={loginUser}>
        <NextHead title={`Settings`} desc={``} />
        <Wrapper>
          <TitleContainer>Account</TitleContainer>
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
