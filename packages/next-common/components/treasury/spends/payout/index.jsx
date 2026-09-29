import { useState } from "react";
import Tabs from "next-common/components/tabs";
import PayoutQueueCard from "./queueCard";
import { payoutQueues } from "./demoData";
import { useDemoClock } from "./demoClock";

export default function PayoutQueues() {
  const clock = useDemoClock();
  const [activeTabValue, setActiveTabValue] = useState(payoutQueues[0].symbol);

  const tabs = payoutQueues.map((queue) => ({
    value: queue.symbol,
    label: queue.symbol,
    tooltip: queue.assetKind,
    activeCount: queue.queue.length,
    content: <PayoutQueueCard queue={queue} clock={clock} />,
  }));

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        tabs={tabs}
        activeTabValue={activeTabValue}
        onTabClick={(tab) => setActiveTabValue(tab.value)}
      />
    </div>
  );
}
