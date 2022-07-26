import styled from "styled-components";
import { useEffect, useState } from "react";

import Toggle from "next-common/components/toggle";
import Button from "next-common/components/button";
import Menu from "next-common/components/menu";
import {
  settingMenu,
  settingMenuOfKeyAccount,
} from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "next-common/store/reducers/userSlice";
import Layout from "next-common/components/layout";
import { shadow_100 } from "styles/componentCss";
import NextHead from "next-common/components/nextHead";
import { isKeyRegisteredUser } from "next-common/utils";
import { useRouter } from "next/router";

const Wrapper = styled.div`
  max-width: 932px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }
  margin: auto;
  @media screen and (min-width: 1080px) {
    padding-bottom: 16px;
  }
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const ContentWrapper = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.textPrimary};
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey200Border};
  ${shadow_100};
  border-radius: 4px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
  }

  input {
    background: ${(props) => props.theme.neutral};
    border-color: ${(props) => props.theme.grey300Border};
    color: ${(props) => props.theme.textPrimary};
  }
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 16px;
  color: ${(props) => props.theme.textPrimary};
`;

const ToggleItem = styled.div`
  display: flex;
  align-items: center;
  line-height: 150%;
  padding: 8px 0;
  > :first-child {
    flex-grow: 1;
  }
  > :last-child {
    flex: 0 0 auto;
    margin-left: 16px;
  }
`;

const Divider = styled.div`
  background: ${(props) => props.theme.grey200Border};
  height: 1px;
  margin: 24px 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  > button {
    width: 80px;
  }
`;

const WarningMessage = styled.div`
  color: ${(props) => props.theme.secondaryRed500};
  background: ${(props) => props.theme.secondaryRed100};
  border-radius: 4px;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 140%;
  margin-bottom: 16px;
`;

export default withLoginUserRedux(({ loginUser, chain }) => {
  const dispatch = useDispatch();
  const [reply, setReply] = useState(!!loginUser?.notification?.reply);
  const [mention, setMention] = useState(!!loginUser?.notification?.mention);
  const [saving, setSaving] = useState(false);

  const disabled =
    loginUser && isKeyRegisteredUser(loginUser) && !loginUser.emailVerified;

  const router = useRouter();

  useEffect(() => {
    if (loginUser === null) {
      router.push("/login");
    }
  }, [loginUser, router]);

  useEffect(() => {
    setReply(!!loginUser?.notification?.reply);
    setMention(!!loginUser?.notification?.mention);
  }, [loginUser]);

  let menu = settingMenu;
  if (loginUser && isKeyRegisteredUser(loginUser)) {
    menu = settingMenuOfKeyAccount;
  }

  const changeGuard = (setter) => async (data) => {
    if (saving) return;
    setter(data);
  };

  const updateNotificationSetting = async () => {
    if (saving) {
      return;
    }

    setSaving(true);
    const { result, error } = await nextApi.patch("user/notification", {
      reply,
      mention,
    });
    if (result) {
      dispatch(fetchUserProfile());
      dispatch(newSuccessToast("Settings saved"));
    } else if (error) {
      dispatch(newErrorToast(error.message));
    }
    setSaving(false);
  };

  return (
    <Layout chain={chain} user={loginUser} left={<Menu menu={menu} />}>
      <NextHead title={`Settings`} desc={``} />
      <Wrapper>
        <Title>Notification</Title>
        <ContentWrapper>
          {disabled && (
            <WarningMessage>
              Please set the email to receive notifications
            </WarningMessage>
          )}
          <div>
            <Label>Email</Label>
            <ToggleItem>
              <div>Notify me about comments on my posts</div>
              <Toggle
                disabled={disabled}
                isOn={reply}
                onToggle={changeGuard(setReply)}
              />
            </ToggleItem>
            <ToggleItem>
              <div>Notify me about mentions</div>
              <Toggle
                disabled={disabled}
                isOn={mention}
                onToggle={changeGuard(setMention)}
              />
            </ToggleItem>
          </div>
          <Divider />
          <ButtonWrapper>
            <Button
              secondary
              disabled={disabled}
              onClick={updateNotificationSetting}
            >
              Save
            </Button>
          </ButtonWrapper>
        </ContentWrapper>
      </Wrapper>
    </Layout>
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
