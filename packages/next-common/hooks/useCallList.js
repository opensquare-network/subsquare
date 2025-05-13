import EvmCallDecodeViewList, {
  extractEvmInputsWithContext,
} from "next-common/components/gov2/referendum/call/evmCallDecode";
import { useRelayChainCallDecodeType } from "next-common/components/gov2/referendum/call/relayChainCallDecode";
import { useOnchainData } from "next-common/context/post";
import isHydradx from "next-common/utils/isHydradx";
import { useEffect, useRef } from "react";
import { useAsync } from "react-use";

export function useCallList() {
  const results = useRef(new Map());
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};
  const inlineCall = onchainData?.inlineCall || {};
  const call = proposal?.call || inlineCall?.call;
  const { value: evmCallDecodes = [] } = useAsync(async () => {
    return isHydradx() ? await extractEvmInputsWithContext(call) : [];
  });

  const {} = useRelayChainCallDecodeType(call);

  useEffect(() => {
    if (evmCallDecodes?.length) {
      results.current.set("EVM Calls", [
        "EVM Calls",
        <EvmCallDecodeViewList
          key="EVM Calls"
          evmCallDecodes={evmCallDecodes}
        />,
      ]);
    }
  }, [evmCallDecodes, results]);

  return {
    calls: results.current?.values() || [],
  };
}
