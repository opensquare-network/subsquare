import Tab from "next-common/components/tab";

export default function CommonTabs({ selectedTabId, setSelectedTabId, tabs }) {
  return (
    <div className="w-full flex justify-center items-center">
      <Tab
        selectedTabId={selectedTabId}
        setSelectedTabId={setSelectedTabId}
        className="h-9 rounded-[22px] p-1"
        btnClassName="w-[120px] px-4 py-2 rounded-[18px]"
        tabs={tabs}
      />
    </div>
  );
}
