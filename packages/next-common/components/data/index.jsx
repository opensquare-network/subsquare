import DataTabsProvider, { useDataTabsContext } from "./context/tabs";
import DataBaseLayout from "./common/baseLayout";
import CommonTabs from "./common/tabs";
import ProxyExplorer from "./proxies";
import VestingExplorer from "./vesting";

function renderActiveTabContent(activeTab) {
  if (activeTab === "proxy") {
    return <ProxyExplorer />;
  } else if (activeTab === "vesting") {
    return <VestingExplorer />;
  }
}

function DataPageContent() {
  const { activeTab, setActiveTab, tabs } = useDataTabsContext();

  return (
    <DataBaseLayout>
      <CommonTabs
        tabs={tabs}
        selectedTabId={activeTab}
        setSelectedTabId={setActiveTab}
      />
      {renderActiveTabContent(activeTab)}
    </DataBaseLayout>
  );
}

export default function Data() {
  return (
    <DataTabsProvider>
      <DataPageContent />
    </DataTabsProvider>
  );
}
