import { useState } from "react";
import { STATS_TAB_ID, TABLE_TAB_ID } from "./viewTypeTabs";
import HeaderBar from "./headerBar";
import StatisticsView from "./statisticsView";
import TableView from "./tableView";

export default function TreasuryProjectsContent() {
  const [selectedTabId, setSelectedTabId] = useState(STATS_TAB_ID);

  return (
    <div className="flex flex-col gap-y-6">
      <HeaderBar
        selectedTabId={selectedTabId}
        setSelectedTabId={setSelectedTabId}
      />
      {selectedTabId === STATS_TAB_ID && <StatisticsView />}
      {selectedTabId === TABLE_TAB_ID && <TableView />}
    </div>
  );
}
