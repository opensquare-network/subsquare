import Tab from "next-common/components/tab";

export default function TimelineModeTabs({ tabId, setTabId }) {
  const tabs = [
    {
      tabId: "normal",
      tabTitle: "Normal",
    },
    {
      tabId: "compact",
      tabTitle: "Compact",
    },
  ];

  return <Tab selectedTabId={tabId} setSelectedTabId={setTabId} tabs={tabs} />;
}
