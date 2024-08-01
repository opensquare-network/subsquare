import ReferendaTracksSummary from "components/referenda/tracks/summary";
import TracksStatus from "components/referenda/tracks/tracksStatus";
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
            <div className="ml-[24px] mb-[16px] text-textPrimary text20Bold">
              Track Status
            </div>
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
