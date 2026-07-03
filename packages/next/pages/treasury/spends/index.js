import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { TreasuryProvider } from "next-common/context/treasury";
import PendingSpendsProvider from "next-common/components/postList/treasurySpendsPostList/pendingContext";
import TreasurySpendsPageContent from "next-common/components/treasury/spends/pageContent";

export default function ProposalsPage({ chain }) {
  return (
    <TreasuryProvider>
      <PendingSpendsProvider>
        <TreasurySpendsPageContent chain={chain} />
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
