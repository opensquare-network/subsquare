import { TreasuryProvider } from "next-common/context/treasury";
import ListLayout from "next-common/components/layout/ListLayout";
import TreasurySummaryPanel from "next-common/components/treasury/statistics/summaryPanel";
import TreasuryStatisticsTabContent from "next-common/components/treasury/statistics/tabContent";
import useLayoutTabs from "next-common/hooks/treasury/proposal/useLayoutTabs";

const seoInfo = { title: "Treasury Statistics", desc: "Treasury Statistics" };

export default function TreasuryStatisticsPage() {
  const tabs = useLayoutTabs();

  return (
    <TreasuryProvider>
      <ListLayout
        seoInfo={seoInfo}
        title="Treasury Statistics"
        summary={<TreasurySummaryPanel />}
        tabs={tabs}
      >
        <TreasuryStatisticsTabContent />
      </ListLayout>
    </TreasuryProvider>
  );
}
