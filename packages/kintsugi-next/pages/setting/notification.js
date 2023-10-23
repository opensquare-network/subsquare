import { withCommonProps } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import SettingLayout from "next-common/components/layout/settingLayout";
import { CACHE_KEY } from "next-common/utils/constants";
import Cookies from "cookies";
import Channels from "next-common/components/setting/channels";
import OnChainEventsSubscription from "components/settings/onchainEventsSubscription";
import DiscussionEventsSubscription from "next-common/components/setting/notification/discussionEventsSubscription";

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

  const cookies = new Cookies(context.req, context.res);
  const authToken = cookies.get(CACHE_KEY.authToken);
  let options = { credentials: true };
  if (authToken) {
    options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }

  const { result: subscription } = await ssrNextApi.fetch(
    "user/subscription",
    {},
    options,
  );

  return {
    props: {
      chain,
      unsubscribe: unsubscribe ?? null,
      subscription: subscription ?? null,
    },
  };
});
