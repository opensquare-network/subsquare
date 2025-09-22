import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchUserSubscription } from "next-common/services/serverSide/subscription";
import Notification from "next-common/components/setting/pages/notification";
import OnChainEventsSubscription from "next-common/components/pages/components/settings/subscription/onchainEventsSubscription";
import { usePageProps } from "next-common/context/page";

export default function NotificationPage() {
  const { ssrTimestamp } = usePageProps();
  return (
    <Notification>
      <OnChainEventsSubscription key={ssrTimestamp} />
    </Notification>
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
      ssrTimestamp: Date.now(),
      ...tracksProps,
    },
  };
});
