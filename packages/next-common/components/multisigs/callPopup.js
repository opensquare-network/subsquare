import useCallFromHex from "next-common/utils/hooks/useCallFromHex";
import {
  convertProposalForJsonView,
  convertProposalForTableView,
} from "next-common/components/proposal";
import { useChain } from "next-common/context/chain";
import dynamicPopup from "next-common/lib/dynamic/popup";
import RawCallProvider from "next-common/context/call/raw";
import { useCallPopup } from "./context/callPopupContext";

const CallDetailPopup = dynamicPopup(() =>
  import("next-common/components/callDetailPopup"),
);

export function CallPopupInContext() {
  const { showPopup, callPopupData, setShowPopup } = useCallPopup();

  if (!showPopup || !callPopupData) {
    return null;
  }

  return (
    <CallPopup
      call={callPopupData?.call}
      callHex={callPopupData?.callHex}
      blockHeight={callPopupData?.blockHeight}
      setShow={setShowPopup}
    />
  );
}

export default function CallPopup({ call, callHex, blockHeight, setShow }) {
  const { call: rawCall, isLoading: isLoadingRawCall } = useCallFromHex(
    callHex,
    blockHeight,
  );
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
