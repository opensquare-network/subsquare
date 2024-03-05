import { useEffect, useState } from "react";
import { hexToU8a } from "@polkadot/util";
import nextApi from "next-common/services/nextApi";
import { useContextApi } from "next-common/context/api";

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

const parseGov2PreImageCall = (bytes, api) => {
  const callData = api.registry.createType("Bytes", bytes);
  return api.registry.createType("Call", callData);
};

const parseDemocracyPreImageCall = (bytes, api) => {
  return api.registry.createType("Proposal", bytes);
};

function parsePreImageCall(proposalHex, api) {
  try {
    return api.registry.createType("Proposal", proposalHex);
  } catch (e) {
    const bytes = hexToU8a(proposalHex);
    try {
      return parseGov2PreImageCall(bytes, api);
    } catch (e) {
      return parseDemocracyPreImageCall(bytes, api);
    }
  }
}

const getBlockApi = async (api, blockHash) => {
  if (blockHash) {
    return api.at(blockHash);
  }
  return api;
};

export function usePreImageCall(preImage, isLoadingPreImage) {
  const api = useContextApi();
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
    let proposalHex;
    if (preImage.isGov2) {
      // Gov2 preImage
      proposalHex = preImage?.hex;
    } else {
      // Democracy preImage
      proposalHex = preImage?.data;
    }

    getBlockApi(api, blockHash)
      .then((blockApi) => {
        return parsePreImageCall(proposalHex, blockApi);
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
