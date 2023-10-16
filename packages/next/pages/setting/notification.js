import styled from "styled-components";
import { useEffect, useState } from "react";

import { withCommonProps } from "next-common/lib";
import nextApi, { ssrNextApi } from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { isKeyRegisteredUser } from "next-common/utils";
import { useRouter } from "next/router";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import Divider from "next-common/components/styled/layout/divider";
import useDiscussionOptions from "next-common/components/setting/notification/useDiscussionOptions";
import {
  fetchAndUpdateUser,
  useUser,
  useUserDispatch,
} from "next-common/context/user";
import {
  ContentWrapper,
  WarningMessage,
} from "next-common/components/setting/styled";
import SettingLayout from "next-common/components/layout/settingLayout";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import NotificationEmail from "next-common/components/setting/notificationEmail";
import NotificationTelegram from "next-common/components/setting/notificationTelegram";
import useSubscription from "components/settings/subscription/useSubscription";
import Cookies from "cookies";
import { CACHE_KEY } from "next-common/utils/constants";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  > button {
    width: 80px;
  }
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export default function NotificationPage({ subscription, unsubscribe }) {
  const loginUser = useUser();
  const isKeyUser = loginUser && isKeyRegisteredUser(loginUser);
  const dispatch = useDispatch();
  const userDispatch = useUserDispatch();
  const [saving, setSaving] = useState(false);
  const [showLoginToUnsubscribe, setShowLoginToUnsubscribe] = useState(false);
  const user = loginUser;
  const {
    subscriptionComponent,
    isSubscriptionChanged,
    updateSubscriptionSetting,
  } = useSubscription({
    subscription,
  });

  const [isTelegramChannelOn, setIsTelegramChannelOn] = useState(
    user?.activeNotificationChannels?.telegram,
  );
  const [isEmailChannelOn, setIsEmailChannelOn] = useState(
    user?.activeNotificationChannels?.email,
  );
  const isActiveChannelsChanged =
    !isTelegramChannelOn !== !user?.activeNotificationChannels?.telegram ||
    !isEmailChannelOn !== !user?.activeNotificationChannels?.email;

  const emailVerified =
    loginUser && isKeyRegisteredUser(loginUser) && !loginUser.emailVerified;
  const isVerifiedUser = loginUser?.emailVerified;

  const {
    discussionOptionsComponent,
    getDiscussionOptionValues,
    isChanged: isNotificationChanged,
  } = useDiscussionOptions({
    disabled: !isVerifiedUser,
    saving,
    reply: !!loginUser?.notification?.reply,
    mention: !!loginUser?.notification?.mention,
  });

  const router = useRouter();

  useEffect(() => {
    if (unsubscribe) {
      if (loginUser === null) {
        setShowLoginToUnsubscribe(true);
      }
      return;
    }

    if (loginUser === null) {
      router.push("/");
    }
  }, [loginUser, router, unsubscribe]);

  const updateNotificationSetting = async () => {
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      let error;

      ({ error } = await nextApi.patch("user/active-channels", {
        email: !!isEmailChannelOn,
        telegram: !!isTelegramChannelOn,
      }));
      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }

      const data = {
        ...getDiscussionOptionValues(),
      };

      ({ error } = await nextApi.patch("user/notification", data));
      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }

      await fetchAndUpdateUser(userDispatch);

      if (isSubscriptionChanged) {
        const { error } = await updateSubscriptionSetting();
        if (error) {
          dispatch(newErrorToast(error.message));
          return;
        }
      }

      dispatch(newSuccessToast("Settings updated"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingLayout>
      {isKeyUser && (
        <SettingSection>
          <TitleContainer>Channels</TitleContainer>
          <ContentWrapper>
            <div className="flex flex-col gap-[16px]">
              {showLoginToUnsubscribe && (
                <WarningMessage>
                  Please login to unsubscribe notifications
                </WarningMessage>
              )}
              {emailVerified && (
                <WarningMessage>
                  Please set the email to receive notifications
                </WarningMessage>
              )}
              <NotificationEmail
                isOn={isEmailChannelOn}
                setIsOn={setIsEmailChannelOn}
              />
              <NotificationTelegram
                isOn={isTelegramChannelOn}
                setIsOn={setIsTelegramChannelOn}
              />
            </div>
          </ContentWrapper>
        </SettingSection>
      )}

      <SettingSection>
        <TitleContainer>Notification Settings</TitleContainer>
        <ContentWrapper>
          <Options>{discussionOptionsComponent}</Options>

          <Divider margin={24} />
          {subscriptionComponent}
          <Divider margin={24} />
          <ButtonWrapper>
            <PrimaryButton
              disabled={
                !isVerifiedUser ||
                (!isNotificationChanged &&
                  !isSubscriptionChanged &&
                  !isActiveChannelsChanged)
              }
              onClick={updateNotificationSetting}
              isLoading={saving}
            >
              Save
            </PrimaryButton>
          </ButtonWrapper>
        </ContentWrapper>
      </SettingSection>
    </SettingLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { unsubscribe } = context.query;

  const cookies = new Cookies(context.req, context.res);
  const authToken = cookies.get(CACHE_KEY.authToken);
  let options = { credentials: true };
  if (authToken) {
    options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }

  const { result: subscription } = await ssrNextApi.fetch(
    "user/subscription",
    {},
    options,
  );
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      subscription: subscription ?? null,
      unsubscribe: unsubscribe ?? null,
      ...tracksProps,
    },
  };
});
