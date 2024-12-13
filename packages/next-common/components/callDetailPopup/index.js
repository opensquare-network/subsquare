import Popup from "next-common/components/popup/wrapper/Popup";
import { ArgsWrapper } from "next-common/components/proposal";
import CallTree from "next-common/components/proposal/callTree";
import Tab from "next-common/components/tab";
import InnerDataTable from "next-common/components/table/innerDataTable";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useLocalStorage } from "react-use";

const JsonView = dynamic(() => import("next-common/components/jsonView"), {
  ssr: false,
});

export default function CallDetailPopup({
  tableViewData,
  jsonViewData,
  hasTreeViewData = true,
  rawCall,
  isLoadingRawCall,
  setShow,
}) {
  const hasTableData = !!tableViewData;
  const hasJsonData = !!jsonViewData;

  const tabs = useMemo(() => {
    const tabs = [];

    if (hasTreeViewData) {
      tabs.push({ tabId: "tree", tabTitle: "Tree" });
    }
    if (hasTableData) {
      tabs.push({ tabId: "table", tabTitle: "Table" });
    }
    if (hasJsonData) {
      tabs.push({ tabId: "json", tabTitle: "JSON" });
    }

    return tabs;
  }, [hasTreeViewData, hasTableData, hasJsonData]);

  const [storageTabId, setStorageTabId] = useLocalStorage(
    "callType",
    tabs[0].tabId,
  );
  // When the storage call type is tree, but tree view is unavailable here,
  // just use the first available call type instead.
  const selectedTabId =
    tabs.find((item) => item.tabId === storageTabId)?.tabId || tabs[0].tabId;
  const setSelectedTabId = setStorageTabId;

  return (
    <Popup title="Call Detail" onClose={() => setShow(false)}>
      <Tab
        tabs={tabs}
        selectedTabId={selectedTabId}
        setSelectedTabId={setSelectedTabId}
      />
      {selectedTabId === "tree" && (
        <CallTree call={rawCall} isLoading={isLoadingRawCall} />
      )}
      {selectedTabId === "table" && (
        <ArgsWrapper className="wrapper text-textPrimary">
          <InnerDataTable data={tableViewData} />
        </ArgsWrapper>
      )}
      {selectedTabId === "json" && (
        <ArgsWrapper className="wrapper">
          <JsonView src={jsonViewData} />
        </ArgsWrapper>
      )}
    </Popup>
  );
}
