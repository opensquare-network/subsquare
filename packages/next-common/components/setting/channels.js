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
import { useUser } from "next-common/context/user";
import { useRouter } from "next/router";
import { isKeyRegisteredUser } from "next-common/utils";

export default function Channels({
  unsubscribe,
  isEmailChannelOn,
  setIsEmailChannelOn,
  isTelegramChannelOn,
  setIsTelegramChannelOn,
}) {
  const loginUser = useUser();
  const isKeyUser = loginUser && isKeyRegisteredUser(loginUser);
  const router = useRouter();
  const [showLoginToUnsubscribe, setShowLoginToUnsubscribe] = useState(false);
  const emailVerified = isKeyUser && !loginUser.emailVerified;

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
          {emailVerified && (
            <WarningMessage>
              Please set and verify the email to receive notifications
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
