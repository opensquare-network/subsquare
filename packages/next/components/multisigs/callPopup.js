import Popup from "next-common/components/popup/wrapper/Popup";
import {
  ArgsWrapper,
  convertProposalForJsonView,
  convertProposalForTableView,
} from "next-common/components/proposal";
import CallTree from "next-common/components/proposal/callTree";
import Tab from "next-common/components/tab";
import InnerDataTable from "next-common/components/table/innerDataTable";
import { useChain } from "next-common/context/chain";
import useCallFromHex from "next-common/utils/hooks/useCallFromHex";
import dynamic from "next/dynamic";
import { useLocalStorage } from "usehooks-ts";

const JsonView = dynamic(() => import("next-common/components/jsonView"), {
  ssr: false,
});

const tabs = [
  { tabId: "tree", tabTitle: "Tree" },
  { tabId: "table", tabTitle: "Table" },
  { tabId: "json", tabTitle: "JSON" },
];

export default function CallPopup({ call, callHex, blockHeight, setShow }) {
  const { call: rawCall, isLoading: isLoadingRawCall } = useCallFromHex(
    callHex,
    blockHeight,
  );
  const chain = useChain();

  const [selectedTabId, setSelectedTabId] = useLocalStorage(
    "callType",
    tabs[0].tabId,
  );
  const tableViewData = convertProposalForTableView(call, chain);

  return (
    <Popup
      title="Call Detail"
      onClose={() => setShow(false)}
      className="w-[650px]"
    >
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
          <JsonView src={convertProposalForJsonView(call, chain)} />
        </ArgsWrapper>
      )}
    </Popup>
  );
}
