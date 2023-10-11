import { useOnchainData } from "next-common/context/post";
import { useCallback, useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";
import { hexToU8a } from "@polkadot/util";

export default function useCallFromProposalHex() {
  const api = useApi();
  const onchainData = useOnchainData();
  const { indexer, proposal } = onchainData || {};
  const [call, setCall] = useState();
  const [isLoading, setIsLoading] = useState(true);

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
    if (!proposal?.hex) {
      setIsLoading(false);
      return;
    }

    if (!api) {
      return;
    }

    decodeCall(proposal.hex, indexer?.blockHash, api)
      .then((callInfo) => {
        if (callInfo) {
          setCall(callInfo);
        }
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, proposal, decodeCall]);

  return [call, isLoading];
}
