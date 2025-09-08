import ReferendaTracksSummary from "next-common/components/referenda/tracks/summary";
import TracksStatus from "next-common/components/referenda/tracks/tracksStatus";
import ReferendaLayout from "next-common/components/layout/referendaLayout";
import { usePageProps } from "next-common/context/page";
import { OnChainReferendaProvider } from "next-common/context/onchainReferenda";
import { ReferendaPalletProvider } from "next-common/context/referenda/pallet";
import { OnChainReferendaTracksProvider } from "next-common/context/referenda/tracks";
import { withReferendaCommonProps } from "next-common/services/serverSide/referenda/common";

function TracksPageLayout({ children }) {
  const { gov2ReferendaSummary } = usePageProps();
  const seoInfo = { title: "Referenda Tracks", desc: "View referenda tracks" };

  return (
    <ReferendaLayout
      title={seoInfo.title}
      description={seoInfo.desc}
      seoInfo={seoInfo}
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

export const getServerSideProps = withReferendaCommonProps();
