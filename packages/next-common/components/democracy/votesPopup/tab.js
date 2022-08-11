import Tab from "../../tab";

export const tabs = [
  {
    tabId: "Aye",
    tabTitle: "Aye",
  },
  {
    tabId: "Nay",
    tabTitle: "Nay",
  },
]
export default function VotesTab({ tabIndex, setTabIndex }) {
  return (
    <Tab
      tabs={tabs}
      selectedTabId={tabIndex}
      setSelectedTabId={setTabIndex}
    />
  );
}
