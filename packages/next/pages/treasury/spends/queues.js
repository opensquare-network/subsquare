import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { TreasuryProvider } from "next-common/context/treasury";
import PendingSpendsProvider from "next-common/components/treasury/spends/pendingContext";
import TreasurySpendsLayout from "next-common/components/treasury/spends/layout";
import PayoutQueues from "next-common/components/treasury/spends/payout";

export default function TreasurySpendsQueuesPage() {
  return (
    <TreasuryProvider>
      <PendingSpendsProvider>
        <TreasurySpendsLayout>
          <PayoutQueues />
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
