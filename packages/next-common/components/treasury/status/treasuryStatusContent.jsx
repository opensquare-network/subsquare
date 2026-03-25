import TreasuryStatusSummaryPanel from "next-common/components/treasury/status/summaryPanel";
import TreasuryStatusTabContent from "next-common/components/treasury/status/tabContent";
import ApprovedPanel from "next-common/components/treasury/status/approvedPanel";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import YearStatus from "next-common/components/treasury/status/yearStatus";
import { PapiProvider } from "next-common/context/papi";

export default function TreasuryStatusContent() {
  return (
    <div className="flex flex-col gap-y-4">
      <PapiProvider>
        <SecondaryCard>
          <TreasuryStatusSummaryPanel />
        </SecondaryCard>
        <ApprovedPanel />
        <YearStatus />
        <TreasuryStatusTabContent />
      </PapiProvider>
    </div>
  );
}
