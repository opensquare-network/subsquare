import Tab from "next-common/components/tab";

export const STATS_TAB_ID = "stats";
export const TABLE_TAB_ID = "table";

const tabs = [
  {
    tabId: STATS_TAB_ID,
    tabTitle: "Stats",
  },
  {
    tabId: TABLE_TAB_ID,
    tabTitle: "Table",
  },
];

export default function ViewTypeTabs({ selectedTabId, setSelectedTabId }) {
  return (
    <div className=" [&>div]:bg-neutral300">
      <Tab
        selectedTabId={selectedTabId}
        setSelectedTabId={(tabId) => {
          setSelectedTabId(tabId);
        }}
        className="h-8 rounded p-1"
        btnClassName="w-[80px] px-4 py-2 rounded max-sm:max-w-[110px]"
        tabs={tabs}
      />
    </div>
  );
}
