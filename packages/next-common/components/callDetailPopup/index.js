import Popup from "next-common/components/popup/wrapper/Popup";
import { ArgsWrapper } from "next-common/components/proposal";
import CallTree from "next-common/components/proposal/callTree";
import Tab from "next-common/components/tab";
import InnerDataTable from "next-common/components/table/innerDataTable";
import dynamic from "next/dynamic";
import { useContext, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "react-use";
import { RawCallContext } from "next-common/context/call/raw";
import PapiContext, { useContextPapi } from "next-common/context/papi";
import PapiCallTreeView from "../papiCallTreeView";
import { useOnchainData } from "next-common/context/post";
import { Binary } from "polkadot-api";
import {
  decodeCallTree,
  getMetadata,
} from "next-common/utils/callDecoder/decoder.mjs";
import Loading from "../loading";

const JsonView = dynamic(() => import("next-common/components/jsonView"), {
  ssr: false,
});

async function fetchPreimage(papi, preimageHash) {
  const status = await papi.query.Preimage.RequestStatusFor.getValue(
    Binary.fromHex(preimageHash),
  );

  if (!status) {
    return null;
  }

  const preimageLen = status.value.len || status.value.maybe_len;

  const preimage = await papi.query.Preimage.PreimageFor.getValue([
    Binary.fromHex(preimageHash),
    preimageLen,
  ]);

  return preimage;
}

async function getPreimageCall(client, papi, preimageHash) {
  const preimage = await fetchPreimage(papi, preimageHash);
  const bytes = preimage.asBytes();
  const metadata = await getMetadata(client);
  return decodeCallTree(bytes, metadata);
}

function useReferendumCall() {
  const [callTreeData, setCallTreeData] = useState(null);
  const onchainData = useOnchainData();
  const { proposalHash } = onchainData || {};
  const { api, client } = useContextPapi();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    setLoading(true);
    getPreimageCall(client, api, proposalHash)
      .then(setCallTreeData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [api, client, proposalHash]);

  return {
    isLoading: loading,
    callTreeData,
  };
}

function PapiCallTreeOnReferendum() {
  const { callTreeData, isLoading } = useReferendumCall();
  if (isLoading) {
    return <Loading />;
  }
  if (!callTreeData) {
    return null;
  }
  return <PapiCallTreeView proposal={callTreeData} isLoading={isLoading} />;
}

function CallTreeOnReferendum() {
  const rawCallCtx = useContext(RawCallContext);
  const papiCtx = useContext(PapiContext);
  if (papiCtx) {
    return <PapiCallTreeOnReferendum />;
  }
  const { call, isLoading } = rawCallCtx;
  return <CallTree call={call} isLoading={isLoading} />;
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

  const CallTreeComponent = customCallTree || CallTreeOnReferendum;
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
