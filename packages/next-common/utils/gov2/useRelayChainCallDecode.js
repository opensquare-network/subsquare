import { getBlockApiByHeight } from "next-common/services/chain/api";
import { useEffect, useMemo, useState } from "react";
import { getXcmLocationApi } from "next-common/utils/gov2/relayChainCall";
import useReferendumVotingFinishHeight, {
  useReferendaIsVoting,
} from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useRealyChainBlockNumberExecute } from "./useRealyChainBlockNumber";
import { noop } from "@polkadot/util";

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

  const apiAndDisconnectPromise = useMemo(async () => {
    try {
      if (!isVoting && !relayChainBlockNumber) {
        return null;
      }
      let disconnect = noop;
      let resultApi = await getXcmLocationApi();
      disconnect = resultApi?.disconnect?.bind(resultApi);
      if (!isVoting) {
        resultApi = await getBlockApiByHeight(resultApi, relayChainBlockNumber);
      }

      return {
        api: resultApi,
        disconnect,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [isVoting, relayChainBlockNumber]);

  useEffect(() => {
    const decodeResults = [];
    async function decode(readyApi) {
      try {
        for (const call of encodeds) {
          const result = readyApi?.registry?.createType("Call", call);
          if (result) {
            decodeResults.push(result.toHuman?.());
          }
        }
        readyApi?.disconnect?.();
        setResults(decodeResults);
      } catch (error) {
        console.error(error);
      }
    }
    if (encodeds?.length) {
      apiAndDisconnectPromise
        .then((api) => api && decode(api))
        .catch(console.error);
    }
  }, [encodeds, apiAndDisconnectPromise]);

  return {
    value: results,
  };
}
