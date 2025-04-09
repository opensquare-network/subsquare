import Tab from "next-common/components/tab";
import { useRouter } from "next/router";
import { useDataTabsContext } from "../context/tabs";

export default function CommonTabs() {
  const { activeTab, tabs } = useDataTabsContext();
  const router = useRouter();

  return (
    <div className="w-full flex justify-center items-center">
      <Tab
        selectedTabId={activeTab}
        setSelectedTabId={(id) => {
          if (activeTab === id) {
            return;
          }
          router.push(id);
        }}
        className="h-9 rounded-[22px] p-1"
        btnClassName="w-[120px] px-4 py-2 rounded-[18px] max-sm:max-w-[110px]"
        tabs={tabs}
      />
    </div>
  );
}
