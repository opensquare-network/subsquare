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
import { useNotificationContext } from "./pages/context";

export default function Channels({ showLoginToUnsubscribe }) {
  const user = useUser();
  const emailNotSet = !user?.email;
  const telegramNotSet = !user?.telegram?.chat;
  const {
    isTelegramChannelOn,
    setIsTelegramChannelOn,
    isEmailChannelOn,
    setIsEmailChannelOn,
  } = useNotificationContext();
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
            <WarningMessage danger>
              Please login to manage notifications
            </WarningMessage>
          )}
          {emailNotSet && telegramNotSet && (
            <WarningMessage danger>
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
