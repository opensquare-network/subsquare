import { getBlockApiByHeight } from "next-common/services/chain/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { useOnchainData } from "next-common/context/post";
import {
  getDestApi,
  clearDestApi,
} from "next-common/utils/gov2/relayChainCall";

export function useReferendaIsActived() {
  const onchainData = useOnchainData();
  return useMemo(() => {
    const name = onchainData?.state?.name;
    return ["Submitted", "DecisionDepositPlaced", "DecisionStarted"].includes(
      name,
    );
  }, [onchainData]);
}

function useRealyChainBlockNumber() {
  const api = useContextApi();
  const onchainData = useOnchainData();
  const isActived = useReferendaIsActived();
  const [relayChainBlockNumber, setRelayChainBlockNumber] = useState();

  useEffect(() => {
    if (!isActived && api) {
      const confirmedTl = onchainData.timeline.find(
        (tl) => tl.name === "DecisionStarted",
      );
      const blockHeight = confirmedTl.indexer.blockHeight;
      if (blockHeight) {
        getBlockApiByHeight(api, blockHeight)
          .then((atApi) =>
            atApi?.query?.parachainSystem.lastRelayChainBlockNumber(),
          )
          .then((res) => res.toNumber())
          .then((relayNumber) => setRelayChainBlockNumber(relayNumber));
      }
    }
  }, [api, isActived, onchainData]);

  return {
    relayChainBlockNumber,
  };
}

export function useRelayChainCallDecode(encodeCalls) {
  const [results, setResults] = useState([]);
  const { relayChainBlockNumber } = useRealyChainBlockNumber();
  const isActived = useReferendaIsActived();

  const getRelayChainApi = useCallback(
    async (destChainId) => {
      if (isActived && !relayChainBlockNumber) {
        return null;
      }
      const destApi = await getDestApi(destChainId);
      if (!isActived) {
        return destApi;
      }
      const destApiAt = await getBlockApiByHeight(
        destApi,
        relayChainBlockNumber,
      );
      return destApiAt;
    },
    [isActived, relayChainBlockNumber],
  );

  useEffect(() => {
    const decodeResults = [];
    async function decode() {
      for (const { destChainId, encodedCalls: calls } of encodeCalls) {
        if (calls.length) {
          try {
            const destApi = await getRelayChainApi(destChainId);
            if (!destApi) {
              continue;
            }
            for (const call of calls) {
              const result = destApi?.registry?.createType("Call", call);
              if (result) {
                decodeResults.push(result.toHuman?.());
              }
            }
            setResults(decodeResults);
          } catch (error) {
            console.error(error);
          }
        }
      }
      clearDestApi();
    }
    if (encodeCalls?.length) {
      decode();
    }
  }, [encodeCalls, getRelayChainApi]);

  return {
    value: results,
    loading: false,
  };
}
