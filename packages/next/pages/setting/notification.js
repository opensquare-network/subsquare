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

export default function NotificationPage() {
  return (
    <SettingLayout>
      <Channels />
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
