import { withCommonProps } from "next-common/lib";
import { fetchUserSubscription } from "next-common/services/serverSide/subscription";
import nextApi from "next-common/services/nextApi";
import Notification from "next-common/components/setting/pages/notification";
import OnChainEventsSubscription from "components/settings/onchainEventsSubscription";
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
  const chain = process.env.CHAIN;
  const { unsubscribe } = context.query;

  const subscription = await fetchUserSubscription(context);
  const { result: summary } = await nextApi.fetch("overview/summary");

  return {
    props: {
      chain,
      unsubscribe: unsubscribe ?? null,
      subscription: subscription ?? null,
      ssrTimestamp: Date.now(),
      summary: summary ?? {},
    },
  };
});
