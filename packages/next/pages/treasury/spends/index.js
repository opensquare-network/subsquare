import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { TreasuryProvider } from "next-common/context/treasury";
import PendingSpendsProvider from "next-common/components/treasury/spends/pendingContext";
import TreasurySpendsPageContent from "next-common/components/treasury/spends/pageContent";
import DemoPapiProvider from "next-common/components/treasury/spends/payout/demoPapiProvider";

const demoEnabled = process.env.NEXT_PUBLIC_PAYOUT_QUEUE_DEMO === "true";

export default function ProposalsPage({ chain }) {
  const content = <TreasurySpendsPageContent chain={chain} />;

  return (
    <TreasuryProvider>
      <PendingSpendsProvider>
        {demoEnabled ? <DemoPapiProvider>{content}</DemoPapiProvider> : content}
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
