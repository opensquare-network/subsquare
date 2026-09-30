import { useRouter } from "next/router";
import Tabs from "next-common/components/tabs";
import Tooltip from "next-common/components/tooltip";
import Loading from "next-common/components/loading";
import { useUrlSearchParams } from "next-common/hooks/useUrlSearchParams";
import { cn } from "next-common/utils";
import PayoutQueueCard from "./queueCard";
import usePayoutQueuesData from "./usePayoutQueuesData";

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

function PayoutQueuesEmpty({ available }) {
  if (available === true) {
    return (
      <div className="py-16 text-center text14Medium text-textTertiary">
        No spends in payout queues.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <span className="text14Medium text-textTertiary">
        This chain does not support the treasury spends payout queue yet.
      </span>
    </div>
  );
}

function PayoutQueuesContent() {
  const router = useRouter();
  const [, , updateSearchParams] = useUrlSearchParams();
  const { queues, loading, available } = usePayoutQueuesData();

  const { queue = "" } = router.query;
  const activeQueue =
    queues.find(
      (item) => item.symbol.toLowerCase() === String(queue).toLowerCase(),
    ) || queues[0];

  if (loading && !queues.length) {
    return (
      <div className="flex justify-center py-16">
        <Loading size={20} />
      </div>
    );
  }

  if (!queues.length) {
    return <PayoutQueuesEmpty available={available} />;
  }

  const tabs = queues.map((queueItem) => ({
    value: queueItem.symbol,
    label: ({ active }) => (
      <TabTitle active={active} tooltip={queueItem.assetKind}>
        {queueItem.symbol}
      </TabTitle>
    ),
    activeCount: queueItem.queue.length,
    content: <PayoutQueueCard queue={queueItem} />,
  }));

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        tabs={tabs}
        activeTabValue={activeQueue.symbol}
        onTabClick={(tab) =>
          updateSearchParams({ queue: tab.value?.toLowerCase?.() })
        }
        tabsListDivider={false}
        tabsListClassName="mx-6"
      />
    </div>
  );
}

export default PayoutQueuesContent;
