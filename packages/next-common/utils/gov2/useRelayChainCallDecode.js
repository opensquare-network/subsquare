import { getBlockApiByHeight } from "next-common/services/chain/api";
import { useEffect, useMemo, useState } from "react";
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

  const api = useMemo(async () => {
    if (isVoting && !relayChainBlockNumber) {
      return null;
    }
    return getXcmLocationApi().then((api) => {
      if (!isVoting) {
        return api;
      }
      return getBlockApiByHeight(api, relayChainBlockNumber);
    });
  }, [isVoting, relayChainBlockNumber]);

  useEffect(() => {
    const decodeResults = [];
    async function decode() {
      try {
        const relayChainApi = await api;
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
  }, [encodeds, api, results]);

  return {
    value: results,
  };
}
