import { TreasuryProvider } from "next-common/context/treasury";
import ListLayout from "next-common/components/layout/ListLayout";
import TreasuryStatusSummaryPanel from "next-common/components/treasury/status/summaryPanel";
import TreasuryStatusTabContent from "next-common/components/treasury/status/tabContent";

const seoInfo = { title: "Treasury Status", desc: "Treasury Status" };

export default function TreasuryStatusPage() {
  return (
    <TreasuryProvider>
      <ListLayout
        seoInfo={seoInfo}
        title="Treasury Status"
        summary={<TreasuryStatusSummaryPanel />}
      >
        <TreasuryStatusTabContent />
      </ListLayout>
    </TreasuryProvider>
  );
}
