import { getBlockApiByHeight } from "next-common/services/chain/api";
import { useCallback, useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { getXcmLocationApi } from "next-common/utils/gov2/relayChainCall";
import useReferendumVotingFinishHeight, {
  useReferendaIsVoting,
} from "next-common/context/post/referenda/useReferendumVotingFinishHeight";

function useRealyChainBlockNumber() {
  const api = useContextApi();
  const isVoting = useReferendaIsVoting();
  const [relayChainBlockNumber, setRelayChainBlockNumber] = useState();
  const blockHeight = useReferendumVotingFinishHeight();

  useEffect(() => {
    if (!isVoting && api && blockHeight) {
      getBlockApiByHeight(api, blockHeight)
        .then((atApi) =>
          atApi?.query?.parachainSystem.lastRelayChainBlockNumber(),
        )
        .then((res) => res.toNumber())
        .then((relayNumber) => setRelayChainBlockNumber(relayNumber))
        .catch(console.error);
    }
  }, [api, isVoting, blockHeight]);

  return {
    relayChainBlockNumber,
  };
}

export function useRelayChainCallDecode(encodeds) {
  const [results, setResults] = useState([]);
  const { relayChainBlockNumber } = useRealyChainBlockNumber();
  const isVoting = useReferendaIsVoting();

  const getRelayChainApi = useCallback(async () => {
    try {
      if (isVoting && !relayChainBlockNumber) {
        return null;
      }
      const api = await getXcmLocationApi();
      if (!isVoting) {
        return api;
      }
      const apiAt = await getBlockApiByHeight(api, relayChainBlockNumber);
      return apiAt;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [isVoting, relayChainBlockNumber]);

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
