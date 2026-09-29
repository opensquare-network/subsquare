import { useState } from "react";
import Tabs from "next-common/components/tabs";
import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";
import PayoutQueueCard from "./queueCard";
import { payoutQueues } from "./demoData";

function TabTitle({ active, tooltip, children }) {
  return (
    <Tooltip className="flex items-center" content={tooltip}>
      <div
        className={cn(
          "cursor-pointer text16Bold whitespace-nowrap",
          active ? "text-textPrimary" : "text-textTertiary",
        )}
      >
        {children}
      </div>
    </Tooltip>
  );
}

export default function PayoutQueues() {
  const [activeTabValue, setActiveTabValue] = useState(payoutQueues[0].symbol);

  const tabs = payoutQueues.map((queue) => ({
    value: queue.symbol,
    label: ({ active }) => (
      <TabTitle active={active} tooltip={queue.assetKind}>
        {queue.symbol}
      </TabTitle>
    ),
    activeCount: queue.queue.length,
    content: <PayoutQueueCard queue={queue} />,
  }));

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        tabs={tabs}
        activeTabValue={activeTabValue}
        onTabClick={(tab) => setActiveTabValue(tab.value)}
        tabsListDivider={false}
        tabsListClassName="mx-6"
      />
    </div>
  );
}
