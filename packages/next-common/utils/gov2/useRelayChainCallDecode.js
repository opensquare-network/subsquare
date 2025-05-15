import { getBlockApiByHeight } from "next-common/services/chain/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { useOnchainData } from "next-common/context/post";
import {
  getXcmLocationApi,
  clearXcmLocationApi,
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
      const decisionStartedTimeLine = onchainData.timeline.find(
        (tl) => tl.name === "DecisionStarted",
      );
      const blockHeight = decisionStartedTimeLine?.indexer?.blockHeight;
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

export function useRelayChainCallDecode(xcmContext) {
  const [results, setResults] = useState([]);
  const { relayChainBlockNumber } = useRealyChainBlockNumber();
  const isActived = useReferendaIsActived();

  const getRelayChainApi = useCallback(
    async (xcmLocation) => {
      if (isActived && !relayChainBlockNumber) {
        return null;
      }
      const destApi = await getXcmLocationApi(xcmLocation);
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
      try {
        const destApi = await getRelayChainApi(xcmContext.xcmLocation);
        for (const call of xcmContext.encodeds) {
          const result = destApi?.registry?.createType("Call", call);
          if (result) {
            decodeResults.push(result.toHuman?.());
          }
        }
        setResults(decodeResults);
      } catch (error) {
        console.error(error);
      }
      clearXcmLocationApi();
    }
    if (xcmContext && !results.length) {
      decode();
    }
  }, [xcmContext, getRelayChainApi, results]);

  return {
    value: results,
    loading: false,
  };
}
