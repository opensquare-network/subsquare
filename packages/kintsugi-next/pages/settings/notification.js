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

export default function Notification() {
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
  const chain = process.env.CHAIN;
  const { unsubscribe } = context.query;

  const subscription = await fetchUserSubscription(context);

  return {
    props: {
      chain,
      unsubscribe: unsubscribe ?? null,
      subscription: subscription ?? null,
    },
  };
});
