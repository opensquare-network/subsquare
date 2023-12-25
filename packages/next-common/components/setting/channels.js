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
import { useState } from "react";
import { useUser } from "next-common/context/user";
import { useDebounceAutoSaveActiveChannelOptions } from "./notification/common";

export default function Channels({ showLoginToUnsubscribe }) {
  const loginUser = useUser();
  const emailNotSet = !loginUser?.email;
  const telegramNotSet = !loginUser?.telegram?.chat;
  const [isTelegramChannelOn, setIsTelegramChannelOn] = useState(
    loginUser?.activeNotificationChannels?.telegram !== false,
  );
  const [isEmailChannelOn, setIsEmailChannelOn] = useState(
    loginUser?.activeNotificationChannels?.email !== false,
  );
  const [isChanged, setIsChanged] = useState(false);

  const updateOption = (setter) => (data) => {
    setter(data);
    setIsChanged(true);
  };

  useDebounceAutoSaveActiveChannelOptions(isChanged, {
    email: isEmailChannelOn,
    telegram: isTelegramChannelOn,
  });

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
              Please bind an email or a telegram account to receive
              notifications.
            </WarningMessage>
          )}
          <NotificationEmail
            isOn={isEmailChannelOn}
            setIsOn={updateOption(setIsEmailChannelOn)}
          />
          <NotificationTelegram
            isOn={isTelegramChannelOn}
            setIsOn={updateOption(setIsTelegramChannelOn)}
          />
        </div>
      </ContentWrapper>
    </SettingSection>
  );
}
