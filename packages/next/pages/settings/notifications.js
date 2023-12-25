import { withCommonProps } from "next-common/lib";
import SettingLayout from "next-common/components/layout/settingLayout";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import Channels from "next-common/components/setting/channels";
import OnChainEventsSubscription from "components/settings/subscription/onchainEventsSubscription";
import DiscussionEventsSubscription from "next-common/components/setting/notification/discussionEventsSubscription";
import { fetchUserSubscription } from "next-common/services/serverSide/subscription";
import RequireSignature from "next-common/components/setting/requireSignature";
import { useConnectedWalletContext } from "next-common/context/connectedWallet";
import { useUser } from "next-common/context/user";
import { useEffect, useState } from "react";
import { usePageProps } from "next-common/context/page";
import { useRouter } from "next/router";

export default function NotificationPage() {
  const { unsubscribe } = usePageProps();
  const loginUser = useUser();
  const { connectedWallet } = useConnectedWalletContext();
  const router = useRouter();
  const [showLoginToUnsubscribe, setShowLoginToUnsubscribe] = useState(false);

  useEffect(() => {
    if (unsubscribe) {
      if (!loginUser && !connectedWallet) {
        setShowLoginToUnsubscribe(true);
      }
      return;
    }

    if (!loginUser && !connectedWallet) {
      router.push("/");
    }
  }, [loginUser, connectedWallet, router, unsubscribe]);

  if (!loginUser && connectedWallet) {
    return (
      <SettingLayout>
        <RequireSignature />
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
  const { unsubscribe } = context.query;

  const subscription = await fetchUserSubscription(context);

  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      subscription: subscription ?? null,
      unsubscribe: unsubscribe ?? null,
      ...tracksProps,
    },
  };
});
