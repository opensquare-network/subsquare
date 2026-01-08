import { useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import TreasuryStatusSummaryPanel from "next-common/components/treasury/status/summaryPanel";
import { CATEGORIZED_TAB_ID, TABLE_TAB_ID } from "./viewTypeTabs";
import HeaderBar from "./headerBar";
import StatisticsView from "./statisticsView";
import TableView from "./tableView";

export default function TreasuryProjectsContent() {
  const [selectedTabId, setSelectedTabId] = useState(CATEGORIZED_TAB_ID);

  return (
    <div className="flex flex-col gap-y-6">
      <SecondaryCard>
        <TreasuryStatusSummaryPanel />
      </SecondaryCard>
      <HeaderBar
        selectedTabId={selectedTabId}
        setSelectedTabId={setSelectedTabId}
      />
      {selectedTabId === CATEGORIZED_TAB_ID && <StatisticsView />}
      {selectedTabId === TABLE_TAB_ID && <TableView />}
    </div>
  );
}
