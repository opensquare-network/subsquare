import Popup from "next-common/components/popup/wrapper/Popup";
import { ArgsWrapper } from "next-common/components/proposal";
import CallTree from "next-common/components/proposal/callTree";
import Tab from "next-common/components/tab";
import InnerDataTable from "next-common/components/table/innerDataTable";
import dynamic from "next/dynamic";
import { useContext, useMemo } from "react";
import { useLocalStorage } from "react-use";
import { RawCallContext } from "next-common/context/call/raw";
import PapiCallTreeView from "../papiCallTreeView";
import Loading from "../loading";
import { usePapiCallTree } from "next-common/context/call/papiCallTree";
import { useChainSettings } from "next-common/context/chain";

const JsonView = dynamic(() => import("next-common/components/jsonView"), {
  ssr: false,
});

function PapiCallTreeOnReferendum() {
  const { callTreeData, isLoading } = usePapiCallTree();
  if (isLoading) {
    return (
      <div className="flex justify-center py-[24px]">
        <Loading size={20} />
      </div>
    );
  }
  if (!callTreeData) {
    return (
      <div className="flex justify-center py-[24px] text-textTertiary text14Medium">
        <span>Fail to parse</span>
      </div>
    );
  }
  return <PapiCallTreeView proposal={callTreeData} isLoading={isLoading} />;
}

function LegacyCallTreeOnReferendum() {
  const rawCallCtx = useContext(RawCallContext) || {};
  const { call, isLoading } = rawCallCtx;
  return <CallTree call={call} isLoading={isLoading} />;
}

function ConfiguredCallTreeOnReferendum() {
  const { enablePapi } = useChainSettings();

  return enablePapi ? (
    <PapiCallTreeOnReferendum />
  ) : (
    <LegacyCallTreeOnReferendum />
  );
}

export default function CallDetailPopup({
  tableViewData,
  jsonViewData,
  hasTreeViewData = true,
  setShow,
  customCallTree = null,
  title = "Call Detail",
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

  const CallTreeComponent = customCallTree || ConfiguredCallTreeOnReferendum;
  // const CallTreeComponent = CallTreeOnReferendum;

  return (
    <Popup title={title} onClose={() => setShow(false)}>
      <Tab
        tabs={tabs}
        selectedTabId={selectedTabId}
        setSelectedTabId={setSelectedTabId}
      />
      {selectedTabId === "tree" && CallTreeComponent && <CallTreeComponent />}
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
