import { useRouter } from "next/router";
import Tabs from "next-common/components/tabs";
import Tooltip from "next-common/components/tooltip";
import Loading from "next-common/components/loading";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import { useUrlSearchParams } from "next-common/hooks/useUrlSearchParams";
import { cn } from "next-common/utils";
import PayoutQueueCard from "./queueCard";
import useDemoLatestHeight from "./demoHeight";
import { usePayoutQueueIsDemo } from "./sourceContext";
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
  const isDemo = usePayoutQueueIsDemo();
  const demoHeight = useDemoLatestHeight(isDemo);
  const chainHeight = useAhmLatestHeight();
  const latestHeight = isDemo ? demoHeight : chainHeight;
  const { queues, loading, available, ready, error } =
    usePayoutQueuesData(latestHeight);

  const { queue = "" } = router.query;
  const activeQueue =
    queues.find(
      (item) => item.id.toLowerCase() === String(queue).toLowerCase(),
    ) || queues[0];

  if (error) {
    return (
      <div className="py-16 text-center text14Medium text-textTertiary">
        Failed to load the payout queues from the chain. Please reload the page.
      </div>
    );
  }

  if (loading && !queues.length) {
    return (
      <div className="flex justify-center py-16">
        <Loading size={20} />
      </div>
    );
  }

  if (!queues.length) {
    // `ready` guards against showing "no spends" while the storages have not
    // emitted yet, in which case the queue ordering is still unknown.
    if (!ready && available !== false) {
      return (
        <div className="flex justify-center py-16">
          <Loading size={20} />
        </div>
      );
    }
    return <PayoutQueuesEmpty available={available} />;
  }

  const tabs = queues.map((queueItem) => ({
    value: queueItem.id,
    label: ({ active }) => (
      <TabTitle active={active} tooltip={queueItem.tooltip}>
        {queueItem.label}
      </TabTitle>
    ),
    activeCount: queueItem.queue.length,
    content: <PayoutQueueCard queue={queueItem} latestHeight={latestHeight} />,
  }));

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        tabs={tabs}
        activeTabValue={activeQueue.id}
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
