import { useEffect } from "react";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import Username from "next-common/components/settingV2/username";
import Email from "next-common/components/settingV2/email";
import Password from "next-common/components/settingV2/password";
import Logout from "next-common/components/settingV2/logout";
import { useRouter } from "next/router";
import { isKeyRegisteredUser } from "next-common/utils";
import SettingLayout from "next-common/components/settingV2/settingLayout";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import { ContentWrapper } from "next-common/components/settingV2/styled";

export default withLoginUserRedux(({ loginUser }) => {
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
    <SettingLayout>
      <SettingSection>
        <TitleContainer>Username</TitleContainer>
        <ContentWrapper>
          <Username username={loginUser?.username} />
        </ContentWrapper>
      </SettingSection>
      <SettingSection>
        <TitleContainer>Email</TitleContainer>
        <ContentWrapper>
          <Email email={loginUser?.email} verified={loginUser?.emailVerified} />
        </ContentWrapper>
      </SettingSection>
      <SettingSection>
        <TitleContainer>Change Password</TitleContainer>
        <ContentWrapper>
          <Password />
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
  return {
    props: {},
  };
});
