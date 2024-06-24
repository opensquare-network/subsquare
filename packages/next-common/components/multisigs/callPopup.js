import useCallFromHex from "next-common/utils/hooks/useCallFromHex";
import {
  convertProposalForJsonView,
  convertProposalForTableView,
} from "next-common/components/proposal";
import { useChain } from "next-common/context/chain";
import dynamicPopup from "next-common/lib/dynamic/popup";

const CallDetailPopup = dynamicPopup(() =>
  import("next-common/components/callDetailPopup"),
);

export default function CallPopup({ call, callHex, blockHeight, setShow }) {
  const { call: rawCall, isLoading: isLoadingRawCall } = useCallFromHex(
    callHex,
    blockHeight,
  );
  const chain = useChain();

  const tableViewData = convertProposalForTableView(call, chain);
  const jsonViewData = convertProposalForJsonView(call, chain);

  return (
    <CallDetailPopup
      tableViewData={tableViewData}
      jsonViewData={jsonViewData}
      rawCall={rawCall}
      isLoadingRawCall={isLoadingRawCall}
      setShow={setShow}
    />
  );
}
