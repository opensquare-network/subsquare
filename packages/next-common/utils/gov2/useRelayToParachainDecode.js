import { useCallback, useEffect, useState } from "react";
import { useRelayChainApi } from "next-common/context/relayChain";
import { getParachainsBlockNumber } from "./getParachainsBlockNumber";
import { getParachainApi } from "./getParachainApi";
import {
  useReferendumVotingFinishIndexer,
  useReferendaIsVoting,
} from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { convertDecodedCallToViewData } from "./useRelayChainCallDecode";
import { isBeforeAhm } from "next-common/hooks/useCompatibleMigrationHeight";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import { getRelayChainBlockNumber } from "next-common/utils/ahm";
import { useContextApi } from "next-common/context/api";
import { isNil } from "lodash-es";

const parachainApiMap = new Map();

const cacheParachainApi = (parachainIdNumber, blockHeight) => {
  const cacheKey = `${parachainIdNumber}-${blockHeight ?? "latest"}`;
  if (!parachainApiMap.has(cacheKey)) {
    const parachainApi = getParachainApi(parachainIdNumber, blockHeight);
    parachainApiMap.set(cacheKey, parachainApi);
  }
  return parachainApiMap.get(cacheKey);
};

export function useRelayToParachainDecode(calls) {
  const [results, setResults] = useState([]);
  const api = useRelayChainApi();
  const contextApi = useContextApi();
  const finishIndexer = useReferendumVotingFinishIndexer();
  const isVoting = useReferendaIsVoting();
  const finishBlockHeight = finishIndexer?.blockHeight;

  const needConvertHeight =
    !isVoting && isAssetHubMigrated() && !isBeforeAhm(finishIndexer);

  const decodedCall = useCallback(
    async (call) => {
      const parachainIdNumber = call.parachainId.toNumber();
      const decodes = [];

      try {
        let blockHeightOrHash = !isVoting ? finishBlockHeight : null;
        if (needConvertHeight && !isNil(blockHeightOrHash)) {
          blockHeightOrHash = await getRelayChainBlockNumber(
            contextApi,
            blockHeightOrHash,
          );
          if (isNil(blockHeightOrHash)) {
            return decodes;
          }
        }

        const parachainsBlock = await getParachainsBlockNumber(
          api,
          parachainIdNumber,
          blockHeightOrHash,
        );
        const cacheApiPromise = cacheParachainApi(
          parachainIdNumber,
          parachainsBlock?.toNumber(),
        );

        const { api: parachainApi } = (await cacheApiPromise) || {};

        for (const bytes of call.bytesArr) {
          const result = parachainApi?.registry?.createType("Call", bytes);
          if (result) {
            const json = convertDecodedCallToViewData(result);
            decodes.push({
              parachainId: call.parachainId,
              json,
              raw: result,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
      return decodes;
    },
    [finishBlockHeight, needConvertHeight, isVoting, api, contextApi],
  );

  useEffect(() => {
    if (!calls.length || !api) {
      return;
    }
    if (needConvertHeight && !contextApi) {
      return;
    }

    Promise.all(calls.map((call) => decodedCall(call))).then((decodes) => {
      setResults(decodes?.flat?.());
    });
  }, [calls, decodedCall, api, needConvertHeight, contextApi]);

  useEffect(() => {
    return () => {
      parachainApiMap.forEach(async (parachainApi) => {
        (await parachainApi)?.disconnect();
      });
      parachainApiMap.clear();
    };
  }, []);

  return {
    value: results,
  };
}
