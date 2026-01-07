import Tab from "next-common/components/tab";

export const CATEGORIZED_TAB_ID = "categorized";
export const TABLE_TAB_ID = "table";

const tabs = [
  {
    tabId: CATEGORIZED_TAB_ID,
    tabTitle: "Categorized",
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
        btnClassName="w-[100px] px-4 py-2 rounded max-sm:max-w-[110px] text12Medium"
        tabs={tabs}
      />
    </div>
  );
}
