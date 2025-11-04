import { withCommonProps } from "next-common/lib";
import { TreasuryProvider } from "next-common/context/treasury";
import ListLayout from "next-common/components/layout/ListLayout";
import TreasuryStatusSummaryPanel from "next-common/components/treasury/status/summaryPanel";
import TreasuryStatusTabContent from "next-common/components/treasury/status/tabContent";
import ApprovedPanel from "next-common/components/treasury/status/approvedPanel";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

const seoInfo = { title: "Treasury Status", desc: "Treasury Status" };

export default function TreasuryStatusPage() {
  return (
    <TreasuryProvider>
      <ListLayout
        seoInfo={seoInfo}
        title="Treasury Status"
        summary={<TreasuryStatusSummaryPanel />}
      >
        <div className="flex flex-col gap-y-4">
          <ApprovedPanel />
          <TreasuryStatusTabContent />
        </div>
      </ListLayout>
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      ...tracksProps,
    },
  };
});
