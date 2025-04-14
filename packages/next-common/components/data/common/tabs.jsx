import Tab from "next-common/components/tab";
import { useRouter } from "next/router";
import { useDataTabsContext } from "../context/tabs";

export default function CommonTabs() {
  const { activeTab, tabs } = useDataTabsContext();
  const router = useRouter();

  return (
    <div className="w-full flex justify-center items-center px-6">
      <Tab
        selectedTabId={activeTab}
        setSelectedTabId={(id) => {
          if (activeTab === id) {
            return;
          }
          router.push(id);
        }}
        className="h-9 rounded-[22px] p-1 w-full md:w-auto"
        btnClassName="w-auto md:w-[120px]  py-2 rounded-[18px] "
        tabs={tabs}
      />
    </div>
  );
}
