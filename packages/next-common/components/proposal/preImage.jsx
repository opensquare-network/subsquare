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

  const parseGov2PreImageCall = useCallback((bytes, api) => {
    const callData = api.registry.createType("Bytes", bytes);
    return api.registry.createType("Call", callData);
  }, []);

  const parseDemocracyPreImageCall = useCallback((bytes, api) => {
    return api.registry.createType("Proposal", bytes);
  }, []);

  const getBlockApi = useCallback(async (api, blockHash) => {
    if (blockHash) {
      return api.at(blockHash);
    }
    return api;
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

    const blockHash = preImage?.indexer.blockHash;
    let proposalHex;
    let parseCall;

    if (preImage.isGov2) {
      // Gov2 preImage
      proposalHex = preImage?.hex;
      parseCall = parseGov2PreImageCall;
    } else {
      // Democracy preImage
      proposalHex = preImage?.data;
      parseCall = parseDemocracyPreImageCall;
    }

    getBlockApi(api, blockHash)
      .then((blockApi) => {
        const bytes = hexToU8a(proposalHex);
        return parseCall(bytes, blockApi);
      })
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
    getBlockApi,
    parseGov2PreImageCall,
    parseDemocracyPreImageCall,
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
