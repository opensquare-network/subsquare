import { withCommonProps } from "next-common/lib";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import SettingLayout from "next-common/components/layout/settingLayout";
import Channels from "next-common/components/setting/channels";
import OnChainEventsSubscription from "components/settings/onchainEventsSubscription";
import DiscussionEventsSubscription from "next-common/components/setting/notification/discussionEventsSubscription";
import { fetchUserSubscription } from "next-common/services/serverSide/subscription";
import { ssrNextApi } from "next-common/services/nextApi";
import RequireSignature from "next-common/components/setting/requireSignature";
import { useUser, useIsLoggedIn } from "next-common/context/user";
import { useEffect, useState } from "react";
import { usePageProps } from "next-common/context/page";
import { useRouter } from "next/router";

export default function Notification() {
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
        <OnChainEventsSubscription />
      </SettingSection>
    </SettingLayout>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const chain = process.env.CHAIN;
  const { unsubscribe } = context.query;

  const subscription = await fetchUserSubscription(context);
  const { result: summary } = await ssrNextApi.fetch("summary");

  return {
    props: {
      chain,
      unsubscribe: unsubscribe ?? null,
      subscription: subscription ?? null,
      summary: summary ?? {},
    },
  };
});
