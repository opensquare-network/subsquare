import {
  ContentWrapper,
  WarningMessage,
} from "next-common/components/setting/styled";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import NotificationEmail from "next-common/components/setting/notificationEmail";
import NotificationTelegram from "next-common/components/setting/notificationTelegram";
import { useEffect, useState } from "react";
import {
  fetchAndUpdateUser,
  useUser,
  useUserDispatch,
} from "next-common/context/user";
import { useRouter } from "next/router";
import { usePageProps } from "next-common/context/page";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";

export default function Channels() {
  const dispatch = useDispatch();
  const userDispatch = useUserDispatch();
  const { unsubscribe } = usePageProps();
  const loginUser = useUser();
  const router = useRouter();
  const [showLoginToUnsubscribe, setShowLoginToUnsubscribe] = useState(false);
  const emailNotSet = !loginUser.email;
  const telegramNotSet = !loginUser.telegram?.chat;
  const [isTelegramChannelOn, setIsTelegramChannelOn] = useState(
    loginUser?.activeNotificationChannels?.telegram !== false,
  );
  const [isEmailChannelOn, setIsEmailChannelOn] = useState(
    loginUser?.activeNotificationChannels?.email !== false,
  );
  const isActiveChannelsChanged =
    isTelegramChannelOn !==
      (loginUser?.activeNotificationChannels?.telegram !== false) ||
    isEmailChannelOn !==
      (loginUser?.activeNotificationChannels?.email !== false);

  useEffect(() => {
    if (!isActiveChannelsChanged) {
      return;
    }

    nextApi
      .patch("user/active-notification-channels", {
        email: !!isEmailChannelOn,
        telegram: !!isTelegramChannelOn,
      })
      .then(({ error }) => {
        if (error) {
          dispatch(newErrorToast(error.message));
          return;
        }
        fetchAndUpdateUser(userDispatch);
      });
  }, [isActiveChannelsChanged, userDispatch]);

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

  return (
    <SettingSection>
      <TitleContainer>Channels</TitleContainer>
      <ContentWrapper>
        <div className="flex flex-col gap-[16px]">
          {showLoginToUnsubscribe && (
            <WarningMessage>
              Please login to unsubscribe notifications
            </WarningMessage>
          )}
          {emailNotSet && telegramNotSet && (
            <WarningMessage>
              Please set the email or telegram to receive notifications
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
  );
}
