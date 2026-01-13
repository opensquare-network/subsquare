import SettingLayout from "next-common/components/layout/settingLayout";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import Channels from "next-common/components/setting/channels";
import DiscussionEventsSubscription from "next-common/components/setting/notification/discussionEventsSubscription";
import RequireSignature from "next-common/components/setting/requireSignature";
import {
  useIsLoggedIn,
  useIsAccountConnectedOnly,
  useUser,
} from "next-common/context/user";
import { useEffect, useState } from "react";
import { usePageProps } from "next-common/context/page";
import { useRouter } from "next/router";
import { useUpdateEffect } from "react-use";
import { NotificationProvider } from "./context";

export default function Notification({ children }) {
  const { unsubscribe } = usePageProps();
  const user = useUser();
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();
  const [showLoginToUnsubscribe, setShowLoginToUnsubscribe] = useState(false);
  const isAccountConnectedOnly = useIsAccountConnectedOnly();

  useEffect(() => {
    if (unsubscribe) {
      if (!user) {
        setShowLoginToUnsubscribe(true);
      }
      return;
    }

    if (!user) {
      router.push("/");
    }
  }, [user, router, unsubscribe]);

  useUpdateEffect(() => {
    router.replace(router.asPath);
  }, [isLoggedIn]);

  if (isAccountConnectedOnly) {
    return (
      <SettingLayout>
        <RequireSignature name="notification" />
      </SettingLayout>
    );
  }

  return (
    <NotificationProvider>
      <SettingLayout>
        <Channels showLoginToUnsubscribe={showLoginToUnsubscribe} />
        <SettingSection>
          <TitleContainer>Notification Settings</TitleContainer>
          <DiscussionEventsSubscription />
          {children}
        </SettingSection>
      </SettingLayout>
    </NotificationProvider>
  );
}
