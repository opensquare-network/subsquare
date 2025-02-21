import { createContext, useEffect, useState } from "react";
import { useOnchainData } from "next-common/context/post";
import useBlockApi from "next-common/utils/hooks/useBlockApi";
import { createGlobalState } from "react-use";
import { isNil } from "lodash-es";
import { parsePreImageCall } from "next-common/components/proposal/preImage";
import getCallByPreimageHash from "next-common/services/preimages/call";

const useCachedResult = createGlobalState({});

export const ReferendumCallContext = createContext(null);

function useReferendumCall() {
  const onchainData = useOnchainData();
  const { inlineCall, proposalHash: hash, indexer } = onchainData || {};
  const api = useBlockApi(indexer?.blockHash);

  const [cachedResult, setCachedResult] = useCachedResult({});
  const result = cachedResult[hash] || null;
  const [loading, setLoading] = useState(isNil(result));

  useEffect(() => {
    if (!api) {
      return;
    }

    if (inlineCall?.hex) {
      setCachedResult((val) => ({
        ...val,
        [hash]: parsePreImageCall(inlineCall.hex, api),
      }));
    } else {
      getCallByPreimageHash(api, hash)
        .then((result) => {
          setCachedResult((val) => ({ ...val, [hash]: result }));
        })
        .finally(() => setLoading(false));
    }

    setLoading(false);
  }, [api, hash, inlineCall, setCachedResult]);

  return {
    isLoading: loading,
    call: result,
  };
}

export default function ReferendumCallProvider({ children }) {
  const { call, isLoading } = useReferendumCall();

  return (
    <ReferendumCallContext.Provider value={{ call, isLoading }}>
      {children}
    </ReferendumCallContext.Provider>
  );
}
