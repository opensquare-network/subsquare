import { getBlockApiByHeight } from "next-common/services/chain/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getXcmLocationApi } from "next-common/utils/gov2/relayChainCall";
import useReferendumVotingFinishHeight, {
  useReferendaIsVoting,
} from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useRealyChainBlockNumberExecute } from "./useRealyChainBlockNumber";

export function useRelayChainCallDecode(encodeds) {
  const [results, setResults] = useState([]);
  const blockHeight = useReferendumVotingFinishHeight();
  const { relayChainBlockNumber, execute: executeRelayChainBlockNumber } =
    useRealyChainBlockNumberExecute(blockHeight);
  const isVoting = useReferendaIsVoting();

  useEffect(() => {
    if (!isVoting && !relayChainBlockNumber) {
      executeRelayChainBlockNumber();
    }
  }, [isVoting, relayChainBlockNumber, executeRelayChainBlockNumber]);

  const apiPromise = useMemo(() => getXcmLocationApi(), []);

  const getRelayChainApi = useCallback(async () => {
    if (isVoting && !relayChainBlockNumber) {
      return null;
    }
    try {
      const api = await apiPromise;
      if (!isVoting) {
        return api;
      }
      const apiAt = await getBlockApiByHeight(api, relayChainBlockNumber);
      return apiAt;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [isVoting, relayChainBlockNumber, apiPromise]);

  useEffect(() => {
    const decodeResults = [];
    async function decode() {
      try {
        const relayChainApi = await getRelayChainApi();
        for (const call of encodeds) {
          const result = relayChainApi?.registry?.createType("Call", call);
          if (result) {
            decodeResults.push(result.toHuman?.());
          }
        }
        relayChainApi?.disconnect();
        setResults(decodeResults);
      } catch (error) {
        console.error(error);
      }
    }
    if (encodeds?.length && !results.length) {
      decode();
    }
  }, [encodeds, getRelayChainApi, results]);

  return {
    value: results,
  };
}
