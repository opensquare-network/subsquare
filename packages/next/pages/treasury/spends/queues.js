import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { TreasuryProvider } from "next-common/context/treasury";
import PendingSpendsProvider from "next-common/components/treasury/spends/pendingContext";
import TreasurySpendsLayout from "next-common/components/treasury/spends/layout";
import PayoutQueues from "next-common/components/treasury/spends/payout";
import DemoPapiProvider from "next-common/components/treasury/spends/payout/demoPapiProvider";

export default function TreasurySpendsQueuesPage() {
  // TODO: Replace DemoPapiProvider with PapiProvider when payout queues are live.
  return (
    <TreasuryProvider>
      <PendingSpendsProvider>
        <DemoPapiProvider>
          <TreasurySpendsLayout>
            <PayoutQueues />
          </TreasurySpendsLayout>
        </DemoPapiProvider>
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
