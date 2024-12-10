import TabsList from "../tabs/list";

export default function WhalesTabs({ currentCount, historyCount }) {
  return (
    <TabsList
      tabs={[
        {
          value: "current",
          label: "Current",
          url: "/referenda/whales",
          activeCount: currentCount || 0,
        },
        {
          value: "history",
          label: "History",
          url: "/referenda/whales/history",
          activeCount: historyCount || 0,
        },
      ]}
    />
  );
}
