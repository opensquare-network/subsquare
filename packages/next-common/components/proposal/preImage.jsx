import { useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";
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

const getBlockApi = async (api, blockHash) => {
  if (blockHash) {
    return api.at(blockHash);
  }
  return api;
};

export function usePreImageCall(preImage, isLoadingPreImage) {
  const api = useApi();
  const [call, setCall] = useState();
  const [isLoading, setIsLoading] = useState(true);

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
    let proposalHex = preImage.isGov2 ? preImage?.hex : preImage.data;
    getBlockApi(api, blockHash)
      .then((blockApi) => {
        return blockApi.registry.createType("Proposal", proposalHex);
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
  }, [api, isLoadingPreImage, preImage]);

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
