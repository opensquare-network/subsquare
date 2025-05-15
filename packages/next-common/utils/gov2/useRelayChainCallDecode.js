import { getBlockApiByHeight } from "next-common/services/chain/api";
import { useEffect, useMemo, useState } from "react";
import { getXcmLocationApi } from "next-common/utils/gov2/relayChainCall";
import useReferendumVotingFinishHeight, {
  useReferendaIsVoting,
} from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useRelayChainBlockNumberExecute } from "./useRealyChainBlockNumber";

export function useRelayChainCallDecode(bytesArr) {
  const [results, setResults] = useState([]);
  const blockHeight = useReferendumVotingFinishHeight();
  const { relayChainBlockNumber, execute: executeRelayChainBlockNumber } =
    useRelayChainBlockNumberExecute(blockHeight);
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

      let disconnect;
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
    async function decode({ api, disconnect }) {
      try {
        for (const bytes of bytesArr) {
          const result = api?.registry?.createType("Call", bytes);
          if (result) {
            decodeResults.push(result.toHuman?.());
          }
        }
        disconnect?.();
        setResults(decodeResults);
      } catch (error) {
        console.error(error);
      }
    }
    if (bytesArr?.length) {
      apiAndDisconnectPromise
        .then((result) => result && decode(result))
        .catch(console.error);
    }
  }, [bytesArr, apiAndDisconnectPromise]);

  return {
    value: results,
  };
}
