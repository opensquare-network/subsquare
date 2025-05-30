import { useEffect, useState } from "react";
import { createGlobalState } from "react-use";
import queryPreimageAtBlock from "next-common/hooks/preimages/query";
import { isNil } from "lodash-es";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

const useCachedResult = createGlobalState({});

export default function useBlockPreimage(hash) {
  const api = useConditionalContextApi();
  const [cachedResult, setCachedResult] = useCachedResult({});
  const result = cachedResult[hash] || null;
  const [loading, setLoading] = useState(isNil(result));

  useEffect(() => {
    if (!api) {
      return;
    }

    setLoading(true);
    queryPreimageAtBlock(api, hash)
      .then((raw) => {
        if (raw) {
          const proposal = api.registry.createType("Proposal", raw);
          setCachedResult((val) => ({ ...val, [hash]: proposal }));
        }
      })
      .finally(() => setLoading(false));
  }, [api, hash, setCachedResult]);

  return {
    isLoading: loading,
    preimage: result,
  };
}
