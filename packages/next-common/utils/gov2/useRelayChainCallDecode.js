import { useEffect, useState } from "react";
import { useRelayChainBlockApi } from "next-common/context/relayChain/blockApi";

export function useRelayChainCallDecode(bytesArr) {
  const [results, setResults] = useState([]);
  const api = useRelayChainBlockApi();

  useEffect(() => {
    const decodeResults = [];

    async function decode(api) {
      try {
        for (const bytes of bytesArr) {
          const result = api?.registry?.createType("Call", bytes);
          if (result) {
            decodeResults.push({
              json: convertDecodedCallToViewData(result),
              raw: result,
            });
          }
        }
        setResults(decodeResults);
      } catch (error) {
        console.error(error);
      }
    }

    if (bytesArr?.length) {
      decode(api).then(() => {
        // ignore
      });
    }
  }, [bytesArr, api]);

  return {
    value: results,
  };
}

export function convertDecodedCallToViewData(call) {
  const { section, method, ...rest } = call.toHuman?.() || {};
  return {
    section,
    method,
    ...rest,
  };
}
