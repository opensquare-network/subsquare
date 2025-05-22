import { useCallback, useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { getParachainsBlockNumber } from "./getParachainsBlockNumber";
import { getParachainApi } from "./getParachainApi";
import useReferendumVotingFinishHeight, {
  useReferendaIsVoting,
} from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { convertDecodedCallToViewData } from "./useRelayChainCallDecode";

const parachainApiMap = new Map();

const cacheParachainApi = (parachainIdNumber, blockHeight) => {
  if (!parachainApiMap.has(parachainIdNumber)) {
    const parachainApi = getParachainApi(parachainIdNumber, blockHeight);
    parachainApiMap.set(parachainIdNumber, parachainApi);
  }
  return parachainApiMap.get(parachainIdNumber);
};

export function useRelayToParachainDecode(calls) {
  const [results, setResults] = useState([]);
  const api = useContextApi();
  const blockHeight = useReferendumVotingFinishHeight();
  const isVoting = useReferendaIsVoting();

  const decodedCall = useCallback(
    async (call) => {
      const parachainIdNumber = call.parachainId.toNumber();
      const decodes = [];

      try {
        const parachainsBlock = await getParachainsBlockNumber(
          api,
          parachainIdNumber,
          !isVoting ? blockHeight : null,
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
    [blockHeight, isVoting, api],
  );

  useEffect(() => {
    if (calls.length && api) {
      Promise.all(calls.map((call) => decodedCall(call))).then((decodes) => {
        setResults(decodes?.flat?.());
      });
    }
  }, [calls, decodedCall, api]);

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
