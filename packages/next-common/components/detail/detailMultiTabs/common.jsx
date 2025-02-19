import Tab from "next-common/components/tab";

export default function CommonMultiTabs({
  selectedTabId,
  setSelectedTabId,
  tabs,
  label,
}) {
  return (
    <div className="w-full flex justify-between items-center">
      <span className="text14Bold">{label}</span>
      <Tab
        selectedTabId={selectedTabId}
        setSelectedTabId={setSelectedTabId}
        className="w-40 h-[28px] rounded-md p-[2px]"
        btnClassName="text12Medium"
        tabs={tabs}
      />
    </div>
  );
}
