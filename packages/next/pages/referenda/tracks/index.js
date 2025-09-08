import ReferendaTracksSummary from "next-common/components/referenda/tracks/summary";
import TracksStatus from "next-common/components/referenda/tracks/tracksStatus";
import ReferendaLayout from "next-common/components/layout/referendaLayout";
import { usePageProps } from "next-common/context/page";
import { OnChainReferendaProvider } from "next-common/context/onchainReferenda";
import { ReferendaPalletProvider } from "next-common/context/referenda/pallet";
import { OnChainReferendaTracksProvider } from "next-common/context/referenda/tracks";
import { withReferendaCommonProps } from "next-common/services/serverSide/referenda/common";

function TracksPageLayout({ children }) {
  const { title, gov2ReferendaSummary } = usePageProps();
  return (
    <ReferendaLayout
      title={title}
      seoInfo={{ title }}
      summaryData={gov2ReferendaSummary}
    >
      {children}
    </ReferendaLayout>
  );
}

export default function TracksPage() {
  return (
    <ReferendaPalletProvider pallet="referenda">
      <OnChainReferendaTracksProvider>
        <OnChainReferendaProvider>
          <TracksPageLayout>
            <div className="flex flex-col gap-[24px]">
              <ReferendaTracksSummary />
              <TracksStatus />
            </div>
          </TracksPageLayout>
        </OnChainReferendaProvider>
      </OnChainReferendaTracksProvider>
    </ReferendaPalletProvider>
  );
}

export const getServerSideProps = withReferendaCommonProps(function () {
  return {
    props: {
      title: "Referenda Tracks",
    },
  };
});
