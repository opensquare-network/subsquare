import useCallFromHex from "next-common/utils/hooks/useCallFromHex";
import {
  convertProposalForJsonView,
  convertProposalForTableView,
} from "next-common/components/proposal";
import { useChain } from "next-common/context/chain";
import dynamic from "next/dynamic";

const CallDetailPopup = dynamic(
  () => import("next-common/components/callDetailPopup"),
  {
    ssr: false,
  },
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
