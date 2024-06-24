import TabsList from "../tabs/tabsList";

export default function WhalesTabs({ currentCount, historyCount }) {
  return (
    <TabsList
      isUrlTabs
      tabs={[
        {
          label: "Current",
          url: "/referenda/whales",
          activeCount: currentCount || 0,
        },
        {
          label: "History",
          url: "/referenda/whales/history",
          activeCount: historyCount || 0,
        },
      ]}
    />
  );
}
