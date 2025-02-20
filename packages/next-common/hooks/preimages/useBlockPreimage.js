import useBlockApi from "next-common/utils/hooks/useBlockApi";
import { useEffect, useState } from "react";
import { createGlobalState } from "react-use";
import queryPreimageAtBlock from "next-common/hooks/preimages/query";
import { isNil } from "lodash-es";

const useCachedResult = createGlobalState({});

export default function useBlockPreimage(hash, blockHash) {
  const api = useBlockApi(blockHash);
  const [cachedResult, setCachedResult] = useCachedResult();
  const result = cachedResult[hash];
  const [loading, setLoading] = useState(isNil(result));

  useEffect(() => {
    if (!api) {
      return;
    }

    setLoading(true);
    queryPreimageAtBlock(api, hash)
      .then((raw) => {
        const proposal = api.registry.createType("Proposal", raw);
        setCachedResult((val) => ({ ...val, [hash]: proposal }));
      })
      .finally(() => setLoading(false));
  }, [api, hash, setCachedResult]);

  return {
    isLoading: loading,
    preimage: result,
  };
}
