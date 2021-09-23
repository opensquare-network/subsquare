import styled from "styled-components";
import { useState } from "react";

import Toggle from "components/toggle";
import Button from "components/button";
import Menu from "components/menu";
import { settingMenu } from "utils/constants";
import { useAuthPage } from "utils/hooks";
import { withLoginUser, withLoginUserRedux } from "../../lib";
import nextApi from "services/nextApi";
import { addToast } from "store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "store/reducers/userSlice";
import LayoutFixedHeader from "../../components/layoutFixedHeader";
import { shadow_100 } from "../../styles/componentCss";

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

export default withLoginUserRedux(({ loginUser }) => {
  const dispatch = useDispatch();
  useAuthPage(true);

  const [reply, setReply] = useState(!!loginUser?.notification?.reply);
  const [mention, setMention] = useState(!!loginUser?.notification?.mention);
  const [thumbsUp, setThumbsUp] = useState(!!loginUser?.notification?.thumbsUp);
  const [saving, setSaving] = useState(false);

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
    <LayoutFixedHeader user={loginUser} left={<Menu menu={settingMenu} />}>
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
    </LayoutFixedHeader>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  return {
    props: {},
  };
});
