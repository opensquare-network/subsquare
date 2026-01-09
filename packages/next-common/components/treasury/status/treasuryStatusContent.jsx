import TreasuryStatusSummaryPanel from "next-common/components/treasury/status/summaryPanel";
import TreasuryStatusTabContent from "next-common/components/treasury/status/tabContent";
import ApprovedPanel from "next-common/components/treasury/status/approvedPanel";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import YearStatus from "next-common/components/treasury/status/yearStatus";

export default function TreasuryStatusContent() {
  return (
    <div className="flex flex-col gap-y-4">
      <SecondaryCard>
        <TreasuryStatusSummaryPanel />
      </SecondaryCard>
      <ApprovedPanel />
      <YearStatus />
      <TreasuryStatusTabContent />
    </div>
  );
}
