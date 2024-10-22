import useCallFromHex from "next-common/utils/hooks/useCallFromHex";
import {
  convertProposalForJsonView,
  convertProposalForTableView,
} from "next-common/components/proposal";
import { useChain } from "next-common/context/chain";

export default function useCallInfoFromHex(multisig) {
  const { call, callHex, when } = multisig;

  const { call: rawCall, isLoading: isLoadingRawCall } = useCallFromHex(
    callHex,
    when?.height,
  );
  const chain = useChain();

  const tableViewData = convertProposalForTableView(call, chain);
  const jsonViewData = convertProposalForJsonView(call, chain);

  return {
    rawCall,
    isLoadingRawCall,
    tableViewData,
    jsonViewData,
  };
}
