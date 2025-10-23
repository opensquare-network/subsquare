import { useContextApi } from "next-common/context/api";
import { getBlockApiByHeight } from "next-common/services/chain/api";
import { useCallback, useEffect, useState } from "react";

export function useRelayChainBlockNumberExecute(blockHeight) {
  const api = useContextApi();
  const [isLoading, setIsLoading] = useState(false);
  const [relayChainBlockNumber, setRelayChainBlockNumber] = useState();

  const execute = useCallback(() => {
    if (api && blockHeight) {
      setIsLoading(true);
      getBlockApiByHeight(api, blockHeight)
        .then((atApi) =>
          atApi?.query?.parachainSystem.lastRelayChainBlockNumber(),
        )
        .then((res) => res.toNumber())
        .then((relayNumber) => setRelayChainBlockNumber(relayNumber))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [api, blockHeight]);

  return {
    execute,
    relayChainBlockNumber,
    isLoading,
  };
}

export function useRelayChainBlockNumber(blockHeight) {
  const { relayChainBlockNumber, isLoading, execute } =
    useRelayChainBlockNumberExecute(blockHeight);

  useEffect(() => {
    execute();
  }, [execute, blockHeight]);

  return {
    relayChainBlockNumber,
    isLoading,
  };
}
