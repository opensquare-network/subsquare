import useCallFromHex, {
  useCallFromHexIndexer,
} from "next-common/utils/hooks/useCallFromHex";
import {
  convertProposalForJsonView,
  convertProposalForTableView,
} from "next-common/components/proposal";
import { useChain } from "next-common/context/chain";
import dynamicPopup from "next-common/lib/dynamic/popup";
import RawCallProvider from "next-common/context/call/raw";
import { useCallPopup } from "./context/callPopupContext";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";

const CallDetailPopup = dynamicPopup(() =>
  import("next-common/components/callDetailPopup"),
);

export function CallPopupInContext() {
  const { showPopup, callPopupData, setShowPopup } = useCallPopup();
  const indexer = useCallFromHexIndexer(callPopupData?.blockHeight);

  if (!showPopup || !callPopupData) {
    return null;
  }

  return (
    <MigrationConditionalApiProvider indexer={indexer}>
      <CallPopup
        call={callPopupData?.call}
        callHex={callPopupData?.callHex}
        setShow={setShowPopup}
      />
    </MigrationConditionalApiProvider>
  );
}

export default function CallPopup({ call, callHex, setShow }) {
  const { call: rawCall, isLoading: isLoadingRawCall } =
    useCallFromHex(callHex);
  const chain = useChain();

  const tableViewData = convertProposalForTableView(call, chain);
  const jsonViewData = convertProposalForJsonView(call, chain);

  return (
    <RawCallProvider call={rawCall} isLoading={isLoadingRawCall}>
      <CallDetailPopup
        tableViewData={tableViewData}
        jsonViewData={jsonViewData}
        setShow={setShow}
      />
    </RawCallProvider>
  );
}
