import { withCommonProps } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import SettingLayout from "next-common/components/layout/settingLayout";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import Cookies from "cookies";
import { CACHE_KEY } from "next-common/utils/constants";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import Channels from "next-common/components/setting/channels";
import OnChainEventsSubscription from "components/settings/subscription/onchainEventsSubscription";
import DiscussionEventsSubscription from "next-common/components/setting/notification/discussionEventsSubscription";

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
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      subscription: subscription ?? null,
      unsubscribe: unsubscribe ?? null,
      ...tracksProps,
    },
  };
});
