import { useCallback, useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";
import { hexToU8a } from "@polkadot/util";

export default function usePreImageCall(preImage, isLoadingPreImage) {
  const api = useApi();
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
    if (isLoadingPreImage) {
      return;
    }

    if (!preImage) {
      setIsLoading(false);
      return;
    }

    if (!api) {
      return;
    }

    const proposalHex = preImage?.hex || preImage?.data;
    const blockHash = preImage?.indexer.blockHash;
    decodeCall(proposalHex, blockHash, api)
      .then((callInfo) => {
        if (callInfo) {
          setCall(callInfo);
        }
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, isLoadingPreImage, preImage, decodeCall]);

  return { call, isLoading };
}
