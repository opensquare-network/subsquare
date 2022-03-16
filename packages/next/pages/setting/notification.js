import styled from "styled-components";
import { useState, useEffect } from "react";

import Toggle from "next-common/components/toggle";
import Button from "next-common/components/button";
import Menu from "next-common/components/menu";
import { settingMenu } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "lib";
import nextApi from "services/nextApi";
import { addToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "next-common/store/reducers/userSlice";
import Layout from "components/layout";
import { shadow_100 } from "styles/componentCss";
import NextHead from "next-common/components/nextHead";

const Wrapper = styled.div`
  max-width: 848px;
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
  color: #1e2134;
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 4px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
  }
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #1e2134;
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
  background: #ebeef4;
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

export default withLoginUserRedux(({ loginUser, chain }) => {
  const dispatch = useDispatch();

  const [reply, setReply] = useState(!!loginUser?.notification?.reply);
  const [mention, setMention] = useState(!!loginUser?.notification?.mention);
  const [thumbsUp, setThumbsUp] = useState(!!loginUser?.notification?.thumbsUp);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setReply(!!loginUser?.notification?.reply);
    setMention(!!loginUser?.notification?.mention);
    setThumbsUp(!!loginUser?.notification?.thumbsUp);
  }, [loginUser]);

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
      thumbsUp,
    });
    if (result) {
      dispatch(fetchUserProfile());
      dispatch(addToast({ type: "success", message: "Settings saved" }));
    } else if (error) {
      dispatch(addToast({ type: "error", message: error.message }));
    }
    setSaving(false);
  };

  return (
    <Layout chain={chain} user={loginUser} left={<Menu menu={settingMenu} />}>
      <NextHead title={`Settings`} desc={``} />
      <Wrapper>
        <Title>Notification</Title>
        <ContentWrapper>
          <div>
            <Label>Email</Label>
            <ToggleItem>
              <div>Notify me about comments on my posts</div>
              <Toggle isOn={reply} onToggle={changeGuard(setReply)} />
            </ToggleItem>
            <ToggleItem>
              <div>Notify me about mentions</div>
              <Toggle isOn={mention} onToggle={changeGuard(setMention)} />
            </ToggleItem>
            <ToggleItem>
              <div>Notify me about supports on my comments</div>
              <Toggle isOn={thumbsUp} onToggle={changeGuard(setThumbsUp)} />
            </ToggleItem>
          </div>
          <Divider />
          <ButtonWrapper>
            <Button secondary onClick={updateNotificationSetting}>
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
