import { useEffect, useState } from "react";
import { hexToU8a } from "@polkadot/util";
import nextApi from "next-common/services/nextApi";
import { useContextApi } from "next-common/context/api";

function usePreImage(preImageHash) {
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
  try {
    return api.registry.createType("Proposal", bytes);
  } catch (e) {
    return null;
  }
};

export function parsePreImageCall(proposalHex, api) {
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

function usePreImageCall(blockHash, proposalHex, isLoadingPreImage) {
  const api = useContextApi();
  const [call, setCall] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoadingPreImage) {
      return;
    }

    if (!api) {
      return;
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
  }, [api, isLoadingPreImage, blockHash, proposalHex]);

  return { call, isLoading };
}

export default function usePreImageCallFromProposal({
  preImageHash,
  preImageHex,
  indexer,
}) {
  const { preImage, isLoading: isLoadingPreImage } = usePreImage(preImageHash);

  let blockHash;
  let proposalHex;

  if (preImage) {
    blockHash = preImage?.indexer?.blockHash;
    if (preImage.isGov2) {
      // Gov2 preImage
      proposalHex = preImage?.hex;
    } else {
      // Democracy preImage
      proposalHex = preImage?.data;
    }
  } else if (indexer && preImageHex) {
    blockHash = indexer.blockHash;
    proposalHex = preImageHex;
  }

  const { call, isLoading: isLoadingCall } = usePreImageCall(
    blockHash,
    proposalHex,
    isLoadingPreImage,
  );

  return {
    call,
    isLoading: isLoadingCall,
  };
}
