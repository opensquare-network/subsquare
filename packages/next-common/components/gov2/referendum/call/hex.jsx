import { useOnchainData } from "next-common/context/post";
import { useCallback, useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";
import { hexToU8a } from "@polkadot/util";

export default function useCallFromHex() {
  const api = useApi();
  const onchainData = useOnchainData();
  const { indexer, proposal } = onchainData || {};
  const [call, setCall] = useState();

  const decodeCall = useCallback(async (hex, blockHash, api) => {
    let blockApi = api;
    if (blockHash) {
      blockApi = await api.at(blockHash);
    }
    const bytes = hexToU8a(hex);
    const callData = blockApi.registry.createType("Bytes", bytes);
    return blockApi.registry.createType("Call", callData);
  }, []);

  useEffect(() => {
    if (!proposal?.hex || !api) {
      return;
    }

    decodeCall(proposal.hex, indexer?.blockHash, api).then((callInfo) => {
      if (callInfo) {
        setCall(callInfo);
      }
    });
  }, [api, proposal, decodeCall]);

  return call;
}
