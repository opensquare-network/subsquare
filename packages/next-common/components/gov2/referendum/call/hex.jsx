import { useOnchainData } from "next-common/context/post";
import { useCallback, useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";
import { hexToU8a } from "@polkadot/util";

export default function useCallFromProposalHex(
  proposalHex,
  isLoadingProposalHex,
) {
  const api = useApi();
  const onchainData = useOnchainData();
  const { indexer } = onchainData || {};
  const [call, setCall] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const decodeCall = useCallback(async (proposalHex, blockHash, api) => {
    let blockApi = api;
    if (blockHash) {
      blockApi = await api.at(blockHash);
    }
    const bytes = hexToU8a(proposalHex);
    const callData = blockApi.registry.createType("Bytes", bytes);
    return blockApi.registry.createType("Call", callData);
  }, []);

  useEffect(() => {
    if (isLoadingProposalHex) {
      return;
    }

    if (!proposalHex) {
      setIsLoading(false);
      return;
    }

    if (!api) {
      return;
    }

    decodeCall(proposalHex, indexer?.blockHash, api)
      .then((callInfo) => {
        if (callInfo) {
          setCall(callInfo);
        }
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, isLoadingProposalHex, proposalHex, decodeCall]);

  return [call, isLoading];
}
