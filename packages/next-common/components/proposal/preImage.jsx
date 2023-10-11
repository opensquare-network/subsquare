import { useCallback, useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";
import { hexToU8a } from "@polkadot/util";
import nextApi from "next-common/services/nextApi";

export function usePreImage(preImageHash) {
  const [preImage, setPreImage] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!preImageHash) {
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();
    setTimeout(() => {
      abortController.abort();
    }, 15 * 1000);
    nextApi
      .fetch(
        `preimages/${preImageHash}`,
        {},
        { signal: abortController.signal },
      )
      .then(({ result, error }) => {
        if (error) {
          return;
        }

        setPreImage(result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [preImageHash]);

  return { preImage, isLoading };
}

export function usePreImageCall(preImage, isLoadingPreImage) {
  const api = useApi();
  const [call, setCall] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const decodeGov2PreImageCall = useCallback(
    async (proposalHex, blockHash, api) => {
      let blockApi = api;
      if (blockHash) {
        blockApi = await api.at(blockHash);
      }
      const bytes = hexToU8a(proposalHex);
      const callData = blockApi.registry.createType("Bytes", bytes);
      return blockApi.registry.createType("Call", callData);
    },
    [],
  );

  const decodeDemocracyPreImageCall = useCallback(
    async (proposalHex, blockHash, api) => {
      let blockApi = api;
      if (blockHash) {
        blockApi = await api.at(blockHash);
      }
      const bytes = hexToU8a(proposalHex);
      return blockApi.registry.createType("Proposal", bytes);
    },
    [],
  );

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

    const blockHash = preImage?.indexer.blockHash;
    let proposalHex = preImage?.hex;
    let decodeCall = decodeGov2PreImageCall;

    if (!proposalHex) {
      // Democracy preImage
      proposalHex = preImage?.data;
      decodeCall = decodeDemocracyPreImageCall;
    }

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
  }, [
    api,
    isLoadingPreImage,
    preImage,
    decodeGov2PreImageCall,
    decodeDemocracyPreImageCall,
  ]);

  return { call, isLoading };
}

export default function usePreImageCallFromHash(preImageHash) {
  const { preImage, isLoading: isLoadingPreImage } = usePreImage(preImageHash);
  const { call, isLoading: isLoadingCall } = usePreImageCall(
    preImage,
    isLoadingPreImage,
  );

  return {
    call,
    isLoading: isLoadingCall,
  };
}
