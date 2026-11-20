import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { TreasuryProvider } from "next-common/context/treasury";
import PendingSpendsProvider from "next-common/components/treasury/spends/pendingContext";
import TreasurySpendsLayout from "next-common/components/treasury/spends/layout";
import PayoutQueues from "next-common/components/treasury/spends/payout";
import DemoPapiProvider from "next-common/components/treasury/spends/payout/demoPapiProvider";

// The demo provider replaces the chain data for UI previews only. Demo spends
// are never signed: the payout dialogs build no transaction for them. It is
// enabled explicitly, otherwise the page reads the chain through the app-level
// PAPI provider.
const demoEnabled = process.env.NEXT_PUBLIC_PAYOUT_QUEUE_DEMO === "true";

export default function TreasurySpendsQueuesPage() {
  const content = <PayoutQueues />;

  return (
    <TreasuryProvider>
      <PendingSpendsProvider>
        <TreasurySpendsLayout>
          {demoEnabled ? (
            <DemoPapiProvider>{content}</DemoPapiProvider>
          ) : (
            content
          )}
        </TreasurySpendsLayout>
      </PendingSpendsProvider>
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      ...tracksProps,
    },
  };
});
