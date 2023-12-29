import SettingLayout from "next-common/components/layout/settingLayout";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import Channels from "next-common/components/setting/channels";
import DiscussionEventsSubscription from "next-common/components/setting/notification/discussionEventsSubscription";
import RequireSignature from "next-common/components/setting/requireSignature";
import { useIsLoggedIn, useUser } from "next-common/context/user";
import { useEffect, useState } from "react";
import { usePageProps } from "next-common/context/page";
import { useRouter } from "next/router";
import { useUpdateEffect } from "usehooks-ts";

export default function Notification({ children }) {
  const { unsubscribe } = usePageProps();
  const user = useUser();
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();
  const [showLoginToUnsubscribe, setShowLoginToUnsubscribe] = useState(false);

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

  if (user && !isLoggedIn) {
    return (
      <SettingLayout>
        <RequireSignature name="notification" />
      </SettingLayout>
    );
  }

  return (
    <SettingLayout>
      <Channels showLoginToUnsubscribe={showLoginToUnsubscribe} />
      <SettingSection>
        <TitleContainer>Notification Settings</TitleContainer>
        <DiscussionEventsSubscription />
        {children}
      </SettingSection>
    </SettingLayout>
  );
}
